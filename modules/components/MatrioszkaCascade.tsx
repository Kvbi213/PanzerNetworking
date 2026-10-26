import React, { useState } from 'react';
import { CRYPTO_SHELLS } from '../crypto/cascade_crypto';
import { Layers, Lock, CheckCircle2 } from 'lucide-react';

export const MatrioszkaCascade: React.FC = () => {
  const [selectedShellId, setSelectedShellId] = useState<number>(3); // Domyślnie XChaCha20 (ARX)

  const activeShell = CRYPTO_SHELLS.find((s) => s.id === selectedShellId) || CRYPTO_SHELLS[2];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="glass-panel rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-bold tracking-display text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-panzer-purple" />
          <span>WIELOWARSTWOWA KASKADA KRYPTOGRAFICZNA (MODEL MATRIOSZKI)</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Hybryda postkwantowa KEM połączona z podwójną kaskadą symetryczną o odmiennych strukturach algebraicznych (SPN + ARX).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Concentric SVG Visualizer */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            KONCENTRYCZNY MODEL POWŁOK SZYFRUJĄCYCH
          </span>

          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Shell 1 */}
              <circle
                cx="150"
                cy="150"
                r="135"
                fill="none"
                stroke="#00f0ff"
                strokeWidth={selectedShellId === 1 ? 5 : 2}
                strokeDasharray="6 4"
                className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setSelectedShellId(1)}
              />

              {/* Shell 2 */}
              <circle
                cx="150"
                cy="150"
                r="110"
                fill="none"
                stroke="#a855f7"
                strokeWidth={selectedShellId === 2 ? 5 : 2}
                className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setSelectedShellId(2)}
              />

              {/* Shell 3 */}
              <circle
                cx="150"
                cy="150"
                r="85"
                fill="none"
                stroke="#10b981"
                strokeWidth={selectedShellId === 3 ? 5 : 2}
                className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setSelectedShellId(3)}
              />

              {/* Shell 4 */}
              <circle
                cx="150"
                cy="150"
                r="60"
                fill="none"
                stroke="#f59e0b"
                strokeWidth={selectedShellId === 4 ? 5 : 2}
                className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setSelectedShellId(4)}
              />

              {/* Shell 5 - Center Core */}
              <circle
                cx="150"
                cy="150"
                r="35"
                fill="rgba(244, 63, 94, 0.2)"
                stroke="#f43f5e"
                strokeWidth={selectedShellId === 5 ? 5 : 2}
                className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setSelectedShellId(5)}
              />

              <text x="150" y="153" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                PAYLOAD
              </text>
            </svg>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-1.5 justify-center pt-2">
            {CRYPTO_SHELLS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedShellId(s.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all btn-press ${
                  selectedShellId === s.id
                    ? 'bg-white/15 border-white/30 text-white font-bold'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                style={{ color: selectedShellId === s.id ? s.color : undefined }}
              >
                P{s.id}: {s.family}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Deconstructed Cryptographic Anatomy */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                WYBRANA POWŁOKA KASKADY (MATRIOSZKA)
              </span>
              <h3 className="text-base font-bold text-white tracking-display" style={{ color: activeShell.color }}>
                {activeShell.name}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              {activeShell.algorithm}
            </span>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-slate-500 block text-[10px]">ROZMIAR KLUCZA / REKOMENDACJA NIST:</span>
              <span className="text-slate-200 font-semibold">{activeShell.keySize}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-slate-500 block text-[10px]">STRUKTURA ALGEBRAICZNA:</span>
              <span className="text-slate-200 font-semibold">{activeShell.mathFoundation}</span>
            </div>
          </div>

          {/* Mathematical Formula Preview */}
          <div className="space-y-1.5 font-mono">
            <span className="text-[11px] text-slate-400 font-semibold">FORMUŁA MATEMATYCZNA OPERACJI:</span>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-panzer-cyan overflow-x-auto whitespace-pre">
              <code>{activeShell.formula}</code>
            </div>
          </div>

          {/* Key Engineering Details */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-semibold">GWARANCJE BEZPIECZEŃSTWA (DEFENSE-IN-DEPTH):</span>
            <ul className="space-y-1.5 font-mono text-xs">
              {activeShell.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-panzer-emerald mt-0.5 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active status */}
          <div className="p-3 rounded-xl bg-panzer-purple/[0.05] border border-panzer-purple/20 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-panzer-purple shrink-0" />
            <span>{activeShell.activeStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
