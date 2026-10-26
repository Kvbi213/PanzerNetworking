import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, DollarSign, Clock } from 'lucide-react';

interface FaqItem {
  q: string;
  category: string;
  a: string;
}

const AUDIT_FAQS: readonly FaqItem[] = [
  {
    category: 'LATENCY & TRADE-OFFS',
    q: 'Czy opóźnienie rzędu ~230 ms nie czyni systemu bezużytecznym do codziennej pracy?',
    a: 'PanzerNetworking to architektura asymetrii kosztów zaprojektowana dla działań high-assurance (bezpieczna komunikacja, OSINT, zarządzanie aktywami, whistleblowing), a nie dla gamingu czy streamingu 4K. Opóźnienie 230 ms pozwala na całkowicie płynne przeglądanie stron WWW, obsługę SSH oraz komunikację tekstową/mailową, eliminując jednocześnie wektor korelacji czasowej GPA.',
  },
  {
    category: 'PHYSICAL LAYER',
    q: 'Dlaczego wybrano akurat pasmo 60 GHz V-Band zamiast standardowego 5 GHz lub LTE/5G?',
    a: 'Pasmo 60 GHz cechuje się unikalnym zjawiskiem rezonansowej absorpcji fal elektromagnetycznych przez dwuatomowe cząsteczki tlenu w atmosferze (tłumienie 15-16 dB/km). W połączeniu z wąską wiązką Pencil Beam (<1.5°), uniemożliwia to podsłuch z boku trasy sygnału oraz detekcję anteny z odległości powyżej kilkuset metrów (LPI/LPD).',
  },
  {
    category: 'DPI & PROBING',
    q: 'W jaki sposób Węzeł 4 radzi sobie z zaawansowanymi sondami cenzorskimi (Active Probing)?',
    a: 'Węzeł 4 wykorzystuje protokół WebTunnel za pełnoprawnym serwerem WWW (Caddy/Nginx) z ważnym certyfikatem TLS Let\'s Encrypt. Każda nieautoryzowana sonda cenzorska wchodząca na ten serwer otrzymuje legalną stronę HTML (np. blog technologiczny) z kodem HTTP 200 OK. Dopiero żądanie z tajną ścieżką URI i nagłówkiem autoryzacyjnym inicjuje cichy upgrade do strumienia WebSocket prowadzącego do gniazda Tora.',
  },
  {
    category: 'CRYPTOGRAPHY',
    q: 'Po co łączyć AES-256 z XChaCha20, skoro oba szyfry uchodzą za bezpieczne?',
    a: 'Zasada Defense-in-Depth i łączenie odmiennych struktur algebraicznych: AES-256 to sieć podstawieniowo-permutacyjna (SPN) operująca na ciałach skończonych GF(2^8), a XChaCha20 to szyfr strumieniowy ARX (Addition-Rotation-XOR) bez tablic S-Box (odporny na cache-timing). Złamanie kaskady wymagałoby równoczesnego załamania dwóch zupełnie różnych gałęzi kryptoanalizy.',
  },
  {
    category: 'OPSEC FAILURE MODES',
    q: 'Jakie są granice ochrony architektury PanzerNetworking?',
    a: 'Architektura chroni wyłącznie warstwę tranzytową i metadane sieciowe. Nie chroni przed kompromitacją stacji roboczej przed zaszyfrowaniem (np. implant sprzętowy w płycie głównej) ani przed błędami OPSEC samego operatora (np. zalogowanie się w przeglądarce na konto zarejestrowane na prywatny numer telefonu lub imienne dane KYC).',
  },
];

export const AuditDefense: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-bold tracking-display text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-panzer-cyan" />
          <span>PANEL AUDYTOWY, PROCEDURY OPSEC I OBRONA ARCHITEKTURY</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Odpowiedzi inżynieryjne na rygorystyczne pytania audytorów bezpieczeństwa, bilans opóźnień i warianty budżetowe (BOM).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latency Budget & BOM Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Latency Budget Table */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs">
            <span className="text-xs font-bold text-panzer-cyan flex items-center gap-1.5 uppercase">
              <Clock className="w-4 h-4" /> BILANS OPÓŹNIEŃ (LATENCY BUDGET RTT)
            </span>
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">L1 Radio 60 GHz (Pencil Beam):</span>
                <span className="text-panzer-cyan font-semibold">&lt; 1 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Węzeł 2: Anycast CDN Edge:</span>
                <span className="text-slate-300 font-semibold">~15 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Węzeł 3: Bufor Poissona (Jitter):</span>
                <span className="text-panzer-purple font-semibold">~40 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Węzeł 4: VPS Ingress Proxy:</span>
                <span className="text-slate-300 font-semibold">~25 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Węzeł 5: Obwód Tor 3-Hop:</span>
                <span className="text-panzer-amber font-semibold">~150 ms</span>
              </div>
              <div className="flex justify-between pt-2 text-white font-bold text-xs">
                <span>CAŁKOWITY RTT TRANZYTU:</span>
                <span className="text-panzer-emerald">~231 ms (Akceptowalny)</span>
              </div>
            </div>
          </div>

          {/* BOM Variants */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs">
            <span className="text-xs font-bold text-panzer-emerald flex items-center gap-1.5 uppercase">
              <DollarSign className="w-4 h-4" /> WARIANTY BUDŻETOWE (BILL OF MATERIALS)
            </span>
            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex justify-between font-bold text-slate-200 mb-1">
                  <span>WARIANT A: ZERO-BUDGET LAB</span>
                  <span className="text-panzer-cyan">0 PLN</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tails na pendrive, darmowy Cloudflare Worker, publiczny WebTunnel i domowy P2P.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-panzer-emerald/[0.04] border border-panzer-emerald/20">
                <div className="flex justify-between font-bold text-panzer-emerald mb-1">
                  <span>WARIANT B: PROSUMER SWEET SPOT</span>
                  <span>~1 800 PLN</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Poleasingowy ThinkPad T480 (~850 zł), most MikroTik wAP 60G (~900 zł), VPS XMR (~35 zł/mc).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex justify-between font-bold text-slate-200 mb-1">
                  <span>WARIANT C: FIELD GRADE</span>
                  <span className="text-panzer-purple">~6 500+ PLN</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Laptop z Coreboot, Cube 60Pro (2 km), autonomiczny DropBox solarny z modemem 5G eSIM.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Q&A Accordion */}
        <div className="lg:col-span-7 space-y-3">
          {AUDIT_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left font-mono transition-colors hover:bg-white/[0.02]"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-panzer-cyan tracking-wider">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-display">
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-panzer-cyan' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', damping: 1.0, stiffness: 140 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs font-mono text-slate-300 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
