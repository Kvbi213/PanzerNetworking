import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SimulationParams } from '../types/simulation';
import { SimulationParticle, PoissonEngine } from '../physics/poisson_engine';
import { Play, Pause, Zap, ShieldAlert, Activity } from 'lucide-react';

interface PhysicsSimulatorProps {
  params: SimulationParams;
  onUpdateParams: (p: Partial<SimulationParams>) => void;
  onTriggerChaffBurst: () => void;
  onTriggerDpiProbe: () => void;
}

export const PhysicsSimulator: React.FC<PhysicsSimulatorProps> = ({
  params,
  onUpdateParams,
  onTriggerChaffBurst,
  onTriggerDpiProbe,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SimulationParticle[]>([]);
  const nextParticleId = useRef<number>(1);
  const poissonEngineRef = useRef<PoissonEngine>(new PoissonEngine(params.poissonLambda));

  useEffect(() => {
    poissonEngineRef.current.setLambda(params.poissonLambda);
  }, [params.poissonLambda]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let spawnTimer = 0;

    // Obsługa Retina / High-DPI
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pozycje 6 węzłów w przestrzeni Canvas
    const getNodePositions = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const step = w / 7;
      const y = h * 0.5;

      return [
        { x: step * 1, y, label: 'W0: Stacja' },
        { x: step * 2, y, label: 'W1: 60GHz' },
        { x: step * 3, y, label: 'W2: Anycast' },
        { x: step * 4, y, label: 'W3: Poisson Mix' },
        { x: step * 5, y, label: 'W4: WebTunnel' },
        { x: step * 6, y, label: 'W5: Tor Exit' },
      ];
    };

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const nodes = getNodePositions();

      // Rysowanie ścieżki tranzytowej
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].x, nodes[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spawnowanie nowych cząstek pakietów na podstawie PPS
      if (!params.isPaused) {
        spawnTimer += delta;
        const interval = 1 / Math.max(1, params.packetsPerSecond);
        if (spawnTimer >= interval) {
          spawnTimer = 0;
          const isChaff = params.constantCoverEnabled && Math.random() < 0.4;
          particlesRef.current.push({
            id: nextParticleId.current++,
            x: nodes[0].x,
            y: nodes[0].y,
            targetX: nodes[1].x,
            targetY: nodes[1].y,
            speed: 180 + Math.random() * 40,
            currentNodeIndex: 0,
            isChaff,
            isDpiProbe: false,
            alpha: 1.0,
            delayRemainingMs: 0,
            inBuffer: false,
            size: isChaff ? 3.5 : 4.5,
          });
        }
      }

      // Aktualizacja i renderowanie cząstek
      particlesRef.current = particlesRef.current.filter((p) => {
        if (params.isPaused) {
          // Rysowanie w stanie pauzy
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.isChaff ? '#f59e0b' : p.isDpiProbe ? '#f43f5e' : '#00f0ff';
          ctx.fill();
          return true;
        }

        // Obsługa bufora Poissona w Węźle 3
        if (p.inBuffer) {
          p.delayRemainingMs -= delta * 1000;
          // Wizualne krążenie cząstki w buforze pamięci RAM
          const angle = (currentTime / 200) + p.id;
          p.x = nodes[3].x + Math.cos(angle) * 22;
          p.y = nodes[3].y + Math.sin(angle) * 22;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.isChaff ? '#f59e0b' : '#00f0ff';
          ctx.shadowColor = p.isChaff ? '#f59e0b' : '#00f0ff';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (p.delayRemainingMs <= 0) {
            p.inBuffer = false;
            // Pakiety Dummy Chaff mogą ulec destrukcji w W3
            if (p.isChaff && Math.random() < 0.5) {
              return false; // Zniszczony w pamięci RAM
            }
            p.currentNodeIndex = 3;
            p.targetX = nodes[4].x;
            p.targetY = nodes[4].y;
          }
          return true;
        }

        // Ruch liniowy w kierunku następnego węzła
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 4) {
          p.currentNodeIndex++;
          if (p.currentNodeIndex === 3) {
            // Wejście do bufora Stop-and-Go Węzła 3
            p.inBuffer = true;
            p.delayRemainingMs = poissonEngineRef.current.sampleExponentialDelayMs();
          } else if (p.currentNodeIndex >= nodes.length - 1) {
            // Dotarcie do celu / Tor Exit
            return false;
          } else {
            p.targetX = nodes[p.currentNodeIndex + 1].x;
            p.targetY = nodes[p.currentNodeIndex + 1].y;
          }
        } else {
          p.x += (dx / dist) * p.speed * delta;
          p.y += (dy / dist) * p.speed * delta;
        }

        // Renderowanie cząstki
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isChaff ? '#f59e0b' : p.isDpiProbe ? '#f43f5e' : '#00f0ff';
        ctx.shadowColor = p.isChaff ? 'rgba(245, 158, 11, 0.6)' : 'rgba(0, 240, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      // Rysowanie Węzłów
      nodes.forEach((n, idx) => {
        const isBufferNode = idx === 3;
        const isDpiNode = (idx === 2 || idx === 4) && params.dpiProbingActive;

        // Okrąg węzła
        ctx.beginPath();
        ctx.arc(n.x, n.y, isBufferNode ? 32 : 20, 0, Math.PI * 2);
        ctx.fillStyle = isDpiNode ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 21, 34, 0.85)';
        ctx.strokeStyle = isDpiNode ? '#f43f5e' : isBufferNode ? '#a855f7' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isBufferNode ? 2 : 1.5;
        ctx.fill();
        ctx.stroke();

        // Wskaźnik bufora Poissona (wirujący pierścień)
        if (isBufferNode) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 26, currentTime / 600, (currentTime / 600) + Math.PI * 1.5);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Etykieta węzła
        ctx.font = '10px -apple-system, system-ui, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + (isBufferNode ? 48 : 36));
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [params.isPaused, params.packetsPerSecond, params.constantCoverEnabled, params.dpiProbingActive]);

  return (
    <div className="space-y-6">
      {/* 60 FPS Particle Canvas Container */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-display text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-panzer-cyan" />
              <span>SYMULATOR FIZYKI RUCHU 60 FPS (DIRECT MANIPULATION)</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Wizualizacja cząsteczkowa przepływu pakietów, wirującego bufora Poissona w Węźle 3 i ruchu Dummy Chaff.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateParams({ isPaused: !params.isPaused })}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 btn-press"
            >
              {params.isPaused ? <Play className="w-3.5 h-3.5 text-panzer-emerald" /> : <Pause className="w-3.5 h-3.5 text-panzer-amber" />}
              <span>{params.isPaused ? 'WZNÓW' : 'WSTRZYMAJ'}</span>
            </button>
          </div>
        </div>

        {/* Canvas Element with Specular Border */}
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-inner">
          <canvas ref={canvasRef} className="w-full h-full block" />
          
          {/* Canvas Legend */}
          <div className="absolute top-3 left-3 flex items-center gap-3 text-[10px] font-mono bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-panzer-cyan shadow-[0_0_8px_#00f0ff]" />
              <span className="text-slate-300">Pakiety Danych (0x01)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-panzer-amber shadow-[0_0_8px_#f59e0b]" />
              <span className="text-slate-300">Dummy Chaff (0xFF)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-panzer-purple" />
              <span className="text-slate-300">Bufor Poissona Stop-and-Go</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Parameter Controls (Apple-style Sliders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PPS Slider */}
        <div className="glass-panel rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">CZĘSTOTLIWOŚĆ (PPS):</span>
            <span className="text-panzer-cyan font-bold">{params.packetsPerSecond} pkt/s</span>
          </div>
          <input
            type="range"
            min={2}
            max={80}
            value={params.packetsPerSecond}
            onChange={(e) => onUpdateParams({ packetsPerSecond: Number(e.target.value) })}
            className="w-full accent-panzer-cyan cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono block">Intensywność strumienia na wejściu</span>
        </div>

        {/* Poisson Lambda Slider */}
        <div className="glass-panel rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">PARAMETR POISSONA &lambda;:</span>
            <span className="text-panzer-purple font-bold">{params.poissonLambda} ms</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            value={params.poissonLambda}
            onChange={(e) => onUpdateParams({ poissonLambda: Number(e.target.value) })}
            className="w-full accent-panzer-purple cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono block">Intensywność opóźnień antykorelacyjnych</span>
        </div>

        {/* Chaff Burst Action */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">RUCH POZORNY:</span>
            <span className="text-xs font-bold text-white block">WSTRZYKNIJ WYBUCH SZUMU</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onTriggerChaffBurst}
            className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-panzer-amber/15 border border-panzer-amber/40 text-panzer-amber hover:bg-panzer-amber/25 flex items-center justify-center gap-1.5 transition-colors btn-press"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>CHAFF BURST (+25 PKT)</span>
          </motion.button>
        </div>

        {/* Active DPI Probing Simulation */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">AUDYT BEZPIECZEŃSTWA:</span>
            <span className="text-xs font-bold text-white block">SONDA AKTYWNA DPI</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onTriggerDpiProbe}
            disabled={params.dpiProbingActive}
            className={`w-full py-2 rounded-xl text-xs font-mono font-bold border flex items-center justify-center gap-1.5 transition-colors btn-press ${
              params.dpiProbingActive
                ? 'bg-panzer-rose/30 border-panzer-rose text-panzer-rose animate-pulse'
                : 'bg-panzer-rose/15 border-panzer-rose/40 text-panzer-rose hover:bg-panzer-rose/25'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{params.dpiProbingActive ? 'SONDA W TOKU...' : 'AKTYWUJ SONDĘ DPI'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
