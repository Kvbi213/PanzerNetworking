import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, KeyRound, Cpu } from 'lucide-react';
import { SimulationParams, SimulationMetrics, PersonaMode } from '../types/simulation';

interface HeaderStatusProps {
  params: SimulationParams;
  metrics: SimulationMetrics;
  onSetPersona: (mode: PersonaMode) => void;
  onTogglePause: () => void;
}

export const HeaderStatus: React.FC<HeaderStatusProps> = ({
  params,
  metrics,
  onSetPersona,
  onTogglePause,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-panzer-border px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Topology Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-panzer-cyan/10 border border-panzer-cyan/30 text-panzer-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-panzer-emerald animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-display text-white">PANZERNETWORKING</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-panzer-cyan font-semibold">
                  v1.2.0-PROD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
                <span>ZERO-TRUST L1–L7</span>
                <span>•</span>
                <span className="text-panzer-emerald font-medium">STATUS: HARDENED</span>
              </p>
            </div>
          </div>

          {/* Quick Pause / Resume */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePause}
            className={`md:hidden px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
              params.isPaused
                ? 'bg-panzer-amber/20 border-panzer-amber/40 text-panzer-amber'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            {params.isPaused ? 'PAUSED' : 'LIVE'}
          </motion.button>
        </div>

        {/* Central Telemetry Gauges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
          {/* PPS Gauge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <Activity className="w-3.5 h-3.5 text-panzer-cyan" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 leading-none">THROUGHPUT</span>
              <span className="font-semibold text-white leading-tight">{metrics.activePps} PPS</span>
            </div>
          </div>

          {/* Shannon Entropy Gauge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-panzer-purple" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 leading-none">ENTROPIA H(X)</span>
              <span className="font-semibold text-panzer-purple leading-tight">
                {metrics.averageEntropy} <span className="text-[9px] text-slate-400 font-normal">b/B</span>
              </span>
            </div>
          </div>

          {/* PFS Key Ratcheting Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <KeyRound className="w-3.5 h-3.5 text-panzer-emerald" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 leading-none">PFS RATCHET</span>
              <span className="font-semibold text-panzer-emerald leading-tight">
                {metrics.secondsToNextRatchet}s <span className="text-[9px] text-slate-400 font-normal">(#{metrics.keysRatchetedCount})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Chameleon Persona Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            {(['GHOST', 'BURNER', 'MULTI_PERSONA'] as PersonaMode[]).map((mode) => {
              const isSelected = params.activePersona === mode;
              return (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSetPersona(mode)}
                  className={`relative px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activePersonaPill"
                      transition={{ type: 'spring', damping: 1.0, stiffness: 120 }}
                      className="absolute inset-0 rounded-lg bg-white/15 border border-white/20 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{mode.replace('_', '-')}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
