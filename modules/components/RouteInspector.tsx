import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TRANSIT_NODES_CONFIG } from '../types/nodes';
import { generateHopInspection } from '../crypto/cascade_crypto';
import { ShieldAlert, Cpu, Eye, EyeOff } from 'lucide-react';

export const RouteInspector: React.FC = () => {
  const [activeHop, setActiveHop] = useState<number>(0);
  const [isChaff, setIsChaff] = useState<boolean>(false);

  const hopData = generateHopInspection(activeHop, isChaff);
  const activeNode = TRANSIT_NODES_CONFIG[activeHop];

  return (
    <div className="space-y-6">
      {/* Step Scrubber / Node Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-display text-white flex items-center gap-2">
              <span>6-WĘZŁOWA MAGISTRALA TRANZYTOWA (OSI L1–L7)</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Wybierz przeskok tranzytowy, aby przeprowadzić dekonstrukcję ramki MTU 1400 B w czasie rzeczywistym.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-mono text-slate-400">TYP ŁADUNKU:</span>
            <button
              onClick={() => setIsChaff(!isChaff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-colors btn-press ${
                isChaff
                  ? 'bg-panzer-amber/20 border-panzer-amber/40 text-panzer-amber'
                  : 'bg-panzer-cyan/20 border-panzer-cyan/40 text-panzer-cyan'
              }`}
            >
              {isChaff ? '0xFF (DUMMY CHAFF)' : '0x01 (REAL DATA CELL)'}
            </button>
          </div>
        </div>

        {/* Interactive Node Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {TRANSIT_NODES_CONFIG.map((node, index) => {
            const isSelected = activeHop === index;
            return (
              <motion.button
                key={node.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveHop(index)}
                className={`relative p-3 rounded-xl border text-left transition-all font-mono text-xs ${
                  isSelected
                    ? 'bg-panzer-cyan/10 border-panzer-cyan/50 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-panzer-cyan font-bold">HOP {index}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                    {node.layer.split(' ')[0]}
                  </span>
                </div>
                <div className="font-semibold text-[11px] truncate text-slate-100">{node.role}</div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">{node.dataRate}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Node Details & Adversary Matrix */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Node Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-panzer-cyan uppercase">
                SPECYFIKACJA WĘZŁA PRZEJŚCIOWEGO
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-panzer-emerald/10 border border-panzer-emerald/30 text-panzer-emerald">
                {activeNode.status.toUpperCase()}
              </span>
            </div>

            <h3 className="text-base font-bold text-white tracking-display">{activeNode.label}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{hopData.description}</p>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Warstwa OSI:</span>
                <span className="text-slate-200">{activeNode.layer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Sprzęt & Środowisko:</span>
                <span className="text-slate-200 truncate max-w-[220px]">{activeNode.hardware}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Średnia Latencja (RTT):</span>
                <span className="text-panzer-cyan">+{activeNode.averageLatencyMs} ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Aktywna Powłoka:</span>
                <span className="text-panzer-purple font-semibold truncate max-w-[220px]">{hopData.activeShell}</span>
              </div>
            </div>
          </div>

          {/* Adversary Perspective (What is visible vs hidden) */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-panzer-amber" />
              <span>PERSPEKTYWA ADWERSARZA (WIDOK LOGÓW PRZECIWNIKA)</span>
            </h4>

            {/* Visible fields */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-panzer-amber font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> CO REJESTRUJE OBSERWATOR NA TYM ETAPIE:
              </span>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 font-mono text-xs">
                {Object.entries(hopData.visibleFields).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-slate-200 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden fields */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-panzer-emerald font-semibold flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5" /> CZEGO MATEMATYCZNIE NIE JEST W STANIE USTALIĆ:
              </span>
              <div className="p-3 rounded-xl bg-panzer-emerald/[0.03] border border-panzer-emerald/20 space-y-1.5 font-mono text-xs">
                {Object.entries(hopData.hiddenFields).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-panzer-emerald font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Wireshark Hex/ASCII & Shannon Entropy Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shannon Entropy Real-Time Gauge */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-panzer-purple flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>ENTROPIA SHANNONA H(X) ŁADUNKU RAMKI</span>
              </span>
              <p className="text-xs text-slate-400 font-mono">
                Wymóg NIST SP 800-22: H(X) &gt; 7.9990 b/B (rozkład losowy bez wzorców DPI).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-2xl font-bold text-panzer-purple tracking-tight">
                  {hopData.entropy.toFixed(4)}
                </div>
                <div className="text-[10px] text-slate-400">bitów / bajt (Max 8.0)</div>
              </div>
              <div className="w-16 h-16 rounded-xl bg-panzer-purple/10 border border-panzer-purple/30 flex items-center justify-center text-panzer-purple font-mono font-bold text-xs">
                PASS
              </div>
            </div>
          </div>

          {/* Wireshark Live Hex Inspector */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-panzer-cyan">
                WIRESHARK LIVE INSPECTOR :: MTU 1400 B (HEX / ASCII DUMP)
              </span>
              <span className="text-[11px] text-slate-400">Offset: 0x0000 - 0x0080</span>
            </div>

            {/* Binary RFC structure breakdown tags */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-panzer-cyan/15 text-panzer-cyan border border-panzer-cyan/30">
                0x00: TLS 1.3 Record (5 B)
              </span>
              <span className="px-2 py-0.5 rounded bg-panzer-emerald/15 text-panzer-emerald border border-panzer-emerald/30">
                0x05: XChaCha20 Nonce (24 B)
              </span>
              <span className="px-2 py-0.5 rounded bg-panzer-amber/15 text-panzer-amber border border-panzer-amber/30">
                0x1D: Type {isChaff ? '0xFF (Chaff)' : '0x01 (Data)'}
              </span>
              <span className="px-2 py-0.5 rounded bg-panzer-purple/15 text-panzer-purple border border-panzer-purple/30">
                Encrypted AES-GCM Payload
              </span>
              <span className="px-2 py-0.5 rounded bg-panzer-rose/15 text-panzer-rose border border-panzer-rose/30">
                Auth Tags (32 B)
              </span>
            </div>

            {/* Hex & ASCII Split Container */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs overflow-x-auto">
              <div className="md:col-span-8 font-mono text-slate-300 leading-relaxed whitespace-pre select-all selection:bg-panzer-cyan/30">
                {hopData.rawHex}
              </div>
              <div className="md:col-span-4 font-mono text-slate-500 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-3 leading-relaxed whitespace-pre select-all">
                {hopData.asciiPreview}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Podgląd pierwszych 128 bajtów znormalizowanej ramki. Wszystkie kolejne bajty aż do 1400 B wypełnione są losowym paddingiem wyrównującym oraz tagami Poly1305 / AES-GCM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
