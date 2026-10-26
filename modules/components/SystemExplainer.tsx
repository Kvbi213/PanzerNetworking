import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Shield,
  Cpu,
  Radio,
  EyeOff,
  DollarSign,
  ExternalLink,
} from 'lucide-react';

const SPRING_TRANSITION = {
  type: 'spring',
  damping: 1.0,
  stiffness: 140,
} as const;

type ExplainerSubtab = 'topology' | 'crypto' | 'kameleon' | 'math' | 'adversary' | 'bom';

export const SystemExplainer: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<ExplainerSubtab>('topology');

  // Live calculator states
  const [shannonText, setShannonText] = useState<string>(
    'G7b$K9!xQ2#Lp90zZ&1*vNm8@5rT+wYq3!pLx9#mK4$zQ8&v9!LaP#1*z'
  );
  const [distKm, setDistKm] = useState<number>(0.25);

  // Calculate Shannon entropy
  const calculateEntropy = (text: string): number => {
    if (!text || text.length === 0) return 0;
    const freq: Record<string, number> = {};
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      freq[c] = (freq[c] || 0) + 1;
    }
    let h = 0;
    const len = text.length;
    for (const c in freq) {
      const p = freq[c] / len;
      h -= p * Math.log2(p);
    }
    return h;
  };

  const entropyValue = calculateEntropy(shannonText);

  // 60 GHz link budget calculation
  const fsplLoss = 128.01 + 20 * Math.log10(Math.max(0.01, distKm));
  const o2Loss = 16.0 * distKm;
  const totalAttenuation = fsplLoss + o2Loss;

  const SUBTABS = [
    { id: 'topology' as const, label: '1. Topologia L1–L7', icon: Radio },
    { id: 'crypto' as const, label: '2. Kaskada Matrioszki', icon: Layers },
    { id: 'kameleon' as const, label: '3. Moduł Kameleon', icon: Shield },
    { id: 'math' as const, label: '4. Fizyka & Matematyka', icon: Cpu },
    { id: 'adversary' as const, label: '5. Macierz Adwersarza', icon: EyeOff },
    { id: 'bom' as const, label: '6. Kosztorys & BOM', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-panzer-cyan/15 text-panzer-cyan border border-panzer-cyan/30">
                MASTER SYSTEM EXPLAINER
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                STANDARD: ANTIGRAVITY PROTOCOL NANO v3.2
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-display text-white">
              PANZERNETWORKING :: DOKTRYNA ARCHITEKTONICZNA
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 max-w-3xl">
              Kompleksowe kompendium inżynieryjne tłumaczące zasady Zero-Trust, kaskadę postkwantową ML-KEM-1024,
              rezonans tlenowy 60 GHz, bufor Poissona oraz niewykrywalność steganograficzną ramki MTU 1400 B.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="system_explainer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-panzer-cyan/40 bg-panzer-cyan/10 text-panzer-cyan hover:bg-panzer-cyan/20 flex items-center gap-1.5 transition-colors btn-press"
            >
              <span>WIDOK STANDALONE HTML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Subtab Segmented Control */}
        <div className="flex flex-wrap gap-1.5 pt-5 border-t border-white/10 mt-5">
          {SUBTABS.map((tab) => {
            const isActive = activeSubtab === tab.id;
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveSubtab(tab.id)}
                className={`relative px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono font-medium transition-colors select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="explainerSubtabPill"
                    transition={SPRING_TRANSITION}
                    className="absolute inset-0 rounded-xl bg-panzer-cyan/15 border border-panzer-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  />
                )}
                <Icon
                  className={`w-3.5 h-3.5 relative z-10 ${
                    isActive ? 'text-panzer-cyan' : 'text-slate-400'
                  }`}
                />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <AnimatePresence mode="wait">
        {activeSubtab === 'topology' && (
          <motion.div
            key="explainer-topology"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING_TRANSITION}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-cyan">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-panzer-cyan font-bold">WĘZEŁ 0: STACJA</span>
                  <span className="text-slate-400">OSI L7 / RAM</span>
                </div>
                <h4 className="text-sm font-bold text-white">Środowisko DRAM Tails / Whonix</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Brak dysków NVMe/SATA, wycięte moduły Wi-Fi/BT. Wymazywanie pamięci RAM w czasie &lt;300 ms przy zaniku zasilania (Cold-Boot Mitigation).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-emerald">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-panzer-emerald font-bold">WĘZEŁ 1: RADIO 60 GHz</span>
                  <span className="text-slate-400">OSI L1 / L2</span>
                </div>
                <h4 className="text-sm font-bold text-white">Wąska Wiązka Pencil Beam &lt;1.5°</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Tłumienie tlenowe 16 dB/km w paśmie V-Band uniemożliwia podsłuch z boku trasy. Punkt zrzutu (DropBox) zasilany solarnie z modemem pre-paid.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-purple">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-panzer-purple font-bold">WĘZEŁ 2: CHMURA ANYCAST</span>
                  <span className="text-slate-400">OSI L4 / L7</span>
                </div>
                <h4 className="text-sm font-bold text-white">Cloudflare Edge Worker + ECH</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Encrypted Client Hello ukrywa nazwę subdomeny. Dostawca w Punkcie A widzi jedynie połączenie z milionami innych legalnych domen.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-amber">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-panzer-amber font-bold">WĘZEŁ 3: WĘZEŁ P2P</span>
                  <span className="text-slate-400">OSI L4 / Mixnet</span>
                </div>
                <h4 className="text-sm font-bold text-white">Bufor Poissona &amp; Dummy Chaff</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Algorytm Stop-and-Go opóźnia pakiety zgodnie z rozkładem wykładniczym. Stałe MTU 1400 B i sztuczny szum niweczą korelację GPA (&Delta;t).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-rose">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-panzer-rose font-bold">WĘZEŁ 4: WEBTUNNEL VPS</span>
                  <span className="text-slate-400">OSI L7 / HTTP/2</span>
                </div>
                <h4 className="text-sm font-bold text-white">Serwer WWW Nginx + Tajny Upgrade</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Skanery cenzorskie otrzymują legalną stronę HTML (200 OK). Dopiero autoryzowany nagłówek podnosi sesję do strumienia WebSocket.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-cyan">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-panzer-cyan font-bold">WĘZEŁ 5: OBWÓD TOR</span>
                  <span className="text-slate-400">OSI L7 / Onion</span>
                </div>
                <h4 className="text-sm font-bold text-white">Trójstopniowy Obwód Cebulowy</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Izolacja strumieni (IsolateSOCKSAuth) wymusza inny obwód wyjściowy dla każdej otwartej domeny. Serwer widzi profil modułu Kameleon.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'crypto' && (
          <motion.div
            key="explainer-crypto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING_TRANSITION}
            className="space-y-4"
          >
            <div className="glass-panel rounded-2xl p-5 space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-white font-sans">
                ANALIZA ALGEBRAICZNA: DLACZEGO ŁĄCZYMY SPN Z ARX ORAZ ML-KEM?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-panzer-purple font-bold block text-sm">
                    ML-KEM-1024 (FIPS 203)
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Opiera się na problemie kratowym Module Learning With Errors (M-LWE). Odporny na algorytm Shora na komputerach kwantowych (brak podatności na Store Now, Decrypt Later).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-panzer-emerald font-bold block text-sm">
                    XCHACHA20-POLY1305 (ARX)
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Szyfr strumieniowy operujący wyłącznie na operacjach dodawania, rotacji i XOR (ARX). Całkowicie eliminuje tablice S-Box podatne na ataki cache-timing w procesorach x86.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-panzer-amber font-bold block text-sm">
                    AES-256-GCM (SPN)
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    14 rund Rijndaela w ciele Galois GF(2^8). Posiada sprzętową akcelerację procesorową (AES-NI). Złamanie kaskady wymaga jednoczesnego sforsowania dwóch odmiennych struktur algebry.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'kameleon' && (
          <motion.div
            key="explainer-kameleon"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING_TRANSITION}
            className="space-y-4"
          >
            <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold text-white font-sans">
                TRZY TRYBY MODUŁU KAMELEON
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-panzer-cyan/15 text-panzer-cyan font-bold shrink-0">
                    GHOST
                  </span>
                  <div>
                    <strong className="text-slate-200 block">Niewykrywalność Antybotowa:</strong>
                    <span className="text-slate-400">
                      Wyjście z czystego IP Węzła 4 (Residential/VPS) ze spoofingiem profilu Windows 11 + Chrome. Omijanie Cloudflare Turnstile i Akamai bez wyzwań CAPTCHA.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-panzer-purple/15 text-panzer-purple font-bold shrink-0">
                    BURNER
                  </span>
                  <div>
                    <strong className="text-slate-200 block">Maksymalna Anonimowość:</strong>
                    <span className="text-slate-400">
                      Pełna 6-węzłowa magistrala na poziomie Safest (brak JS, WebGL, czcionek). Jednorazowy kontener RAM ulegający samozniszczeniu po zamknięciu.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-panzer-emerald/15 text-panzer-emerald font-bold shrink-0">
                    MULTI-PERSONA
                  </span>
                  <div>
                    <strong className="text-slate-200 block">Separacja Tożsamości:</strong>
                    <span className="text-slate-400">
                      Osobny obwód Tor i unikalne ziarno Canvas poisoning dla każdej otwartej karty. Dla systemów analityki internetowej 3 karty wyglądają jak 3 różne komputery w 3 różnych krajach.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'math' && (
          <motion.div
            key="explainer-math"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING_TRANSITION}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shannon Entropy Tool */}
              <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-panzer-purple text-sm">
                    ENTROPIA SHANNONA H(X)
                  </span>
                  <span className="text-base font-bold text-panzer-purple">
                    {entropyValue.toFixed(4)} b/B
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Wpisz dowolny ciąg znaków, aby przetestować równomierność rozkładu bajtów w ładunku:
                </p>
                <textarea
                  value={shannonText}
                  onChange={(e) => setShannonText(e.target.value)}
                  className="w-full h-20 p-2.5 rounded-xl bg-black/50 border border-white/10 text-slate-200 resize-none outline-none focus:border-panzer-purple/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setShannonText(
                        Array.from({ length: 256 }, () =>
                          String.fromCharCode(Math.floor(Math.random() * 256))
                        ).join('')
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-panzer-purple/20 text-panzer-purple border border-panzer-purple/40 text-[11px] font-bold btn-press"
                  >
                    GENERUJ STRUMIEŃ SZYFROWANY (&gt;7.999 b/B)
                  </button>
                </div>
              </div>

              {/* 60 GHz Link Budget */}
              <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-panzer-cyan text-sm">
                    TŁUMIENIE 60 GHz V-BAND
                  </span>
                  <span className="text-base font-bold text-panzer-cyan">
                    -{totalAttenuation.toFixed(1)} dB
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Rezonans tlenowy (O2) powoduje tłumienie 16 dB/km. Przesuń suwak odległości:
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dystans:</span>
                    <span className="text-white font-bold">{distKm.toFixed(2)} km ({Math.round(distKm * 1000)} m)</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={3.0}
                    step={0.05}
                    value={distKm}
                    onChange={(e) => setDistKm(parseFloat(e.target.value))}
                    className="w-full accent-panzer-cyan"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
                  <div>Tłumienie tlenowe O2: <span className="text-panzer-rose font-bold">{o2Loss.toFixed(1)} dB</span></div>
                  <div>Tłumienie FSPL wolnej przestrzeni: <span className="text-slate-300 font-bold">{fsplLoss.toFixed(1)} dB</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'adversary' && (
          <motion.div
            key="explainer-adversary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING_TRANSITION}
            className="space-y-4"
          >
            <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs overflow-x-auto">
              <h3 className="text-sm font-bold text-white font-sans">
                WIDOK OBSERWATORA SIECIOWEGO
              </h3>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2 pr-4">Adwersarz</th>
                    <th className="py-2 pr-4">Widoczne w logach</th>
                    <th className="py-2 pr-4 text-panzer-emerald">Niewykrywalne</th>
                    <th className="py-2">Mitygacja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-2.5 pr-4 text-panzer-cyan font-bold">Domowy ISP</td>
                    <td className="py-2.5 pr-4">0 B (Brak ruchu na linii)</td>
                    <td className="py-2.5 pr-4 text-panzer-emerald">Fakt obecności przy stacji</td>
                    <td className="py-2.5">Most radiowy 60 GHz</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-panzer-cyan font-bold">Skaner Radiowy</td>
                    <td className="py-2.5 pr-4">Szum tła 2.4/5 GHz</td>
                    <td className="py-2.5 pr-4 text-panzer-emerald">Istnienie wiązki 60 GHz</td>
                    <td className="py-2.5">Pencil Beam &lt;1.5° &amp; O2</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-panzer-cyan font-bold">ISP Punktu A</td>
                    <td className="py-2.5 pr-4">TLS do IP Anycast Cloudflare</td>
                    <td className="py-2.5 pr-4 text-panzer-emerald">Subdomena, treść, cel</td>
                    <td className="py-2.5">Encrypted Client Hello</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-panzer-cyan font-bold">Globalny IXP</td>
                    <td className="py-2.5 pr-4">Strumień CBR o stałym MTU</td>
                    <td className="py-2.5 pr-4 text-panzer-emerald">Korelacja &Delta;t i objętość</td>
                    <td className="py-2.5">Bufor Poissona + Dummy Chaff</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-panzer-cyan font-bold">Serwis Docelowy</td>
                    <td className="py-2.5 pr-4">Adres IP węzła Tor Exit</td>
                    <td className="py-2.5 pr-4 text-panzer-emerald">System Tails, IP stacji</td>
                    <td className="py-2.5">Kameleon Spoofing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'bom' && (
          <motion.div
            key="explainer-bom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING_TRANSITION}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-cyan">
                <div className="flex justify-between font-bold">
                  <span className="text-white">WARIANT A: LAB</span>
                  <span className="text-panzer-cyan">0 PLN</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Tails na pendrive, darmowy Cloudflare Worker (100k req/d), publiczny mostek WebTunnel ze społeczności Tor.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-emerald">
                <div className="flex justify-between font-bold">
                  <span className="text-white">WARIANT B: PROSUMER</span>
                  <span className="text-panzer-emerald">~1 800 PLN</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Poleasingowy ThinkPad T480 (~850 zł), para anten MikroTik Wireless Wire 60G (~900 zł), VPS No-KYC za XMR (~35 zł/mc).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-2 border-t-2 border-panzer-purple">
                <div className="flex justify-between font-bold">
                  <span className="text-white">WARIANT C: FIELD</span>
                  <span className="text-panzer-purple">~6 500+ PLN</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Laptop z Coreboot, MikroTik Cube 60Pro (2 km), autonomiczny DropBox solarny LiFePO4 z modemem 5G eSIM pre-paid.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
