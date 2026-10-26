import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, ShieldCheck } from 'lucide-react';

interface AttackScenario {
  id: string;
  name: string;
  threatLevel: 'KRYTYCZNY' | 'WYSOKI' | 'ŚREDNI';
  adversaryModel: string;
  attackMechanism: string;
  successProbability: string;
  mitigationMechanism: string;
  verificationAudit: string;
}

const ATTACK_SCENARIOS: readonly AttackScenario[] = [
  {
    id: 'gpa',
    name: '1. GLOBAL PASSIVE ADVERSARY (ATAK KORELACJI CZASOWEJ IXP)',
    threatLevel: 'KRYTYCZNY',
    adversaryModel: 'Agencja wywiadowcza monitorująca główne punkty wymiany ruchu światłowodowego (IXP).',
    attackMechanism: 'Próba powiązania wejściowego strumienia pakietów w Punkcie A ze strumieniem wyjściowym z Tora na podstawie odstępów czasowych (delta t) i objętości danych.',
    successProbability: '< 0.0001% (Złożoność O(n!))',
    mitigationMechanism: 'Bufor Stop-and-Go w Węźle 3 opóźnia pakiety zgodnie z rozkładem wykładniczym Poissona (własność braku pamięci). Ruch pozorne Dummy Chaff i stałe MTU 1400 B utrzymują stały profil CBR.',
    verificationAudit: 'Test Kołmogorowa-Smirnowa wykazuje brak korelacji krzyżowej (współczynnik Pearsona r < 0.05).',
  },
  {
    id: 'exit_node',
    name: '2. KOMPROMITACJA WĘZŁA WYJŚCIOWEGO TORA (ROGUE EXIT NODE)',
    threatLevel: 'ŚREDNI',
    adversaryModel: 'Wrogi operator kontrolujący węzeł wyjściowy sieci Tor (Tor Exit Node).',
    attackMechanism: 'Podsłuch surowych zapytań HTTP opuszczających sieć cebulową w celu zidentyfikowania tożsamości nadawcy lub wstrzyknięcia złośliwej zawartości (Man-in-the-Middle).',
    successProbability: '0.00% (Dla tożsamości nadawcy)',
    mitigationMechanism: 'Węzeł wyjściowy widzi jedynie zunifikowane wyjście modułu Kameleon oraz docelowy tunel HTTPS serwisu. Węzeł Exit nie zna adresu IP Węzła 4, 3, 2, 1 ani 0.',
    verificationAudit: 'Analiza pcap wykazuje, że jedyne dane w komórce exit to docelowy szyfr TLS oraz uniwersalny fingerprint.',
  },
  {
    id: 'shor',
    name: '3. ATAK KWANTOWY SHORA (STORE NOW, DECRYPT LATER - SNDL)',
    threatLevel: 'WYSOKI',
    adversaryModel: 'Adwersarz archiwizujący terabajty zaszyfrowanego ruchu w oczekiwaniu na komputery kwantowe.',
    attackMechanism: 'Zastosowanie algorytmu Shora do szybkiej faktoryzacji lub rozwiązania logarytmu dyskretnego na klasycznych kluczach RSA / ECDH.',
    successProbability: '0.00% (Kaskada odporna na Q-Day)',
    mitigationMechanism: 'Powłoka 2 implementuje hybrydowy KEM: ML-KEM-1024 (FIPS 203) oparty o trudność problemu kratowego M-LWE, połączony z klasyczną krzywą X25519.',
    verificationAudit: 'Złożoność złamania kraty M-LWE algorytmem kwantowym przekracza 2^128 operacji.',
  },
  {
    id: 'cold_boot',
    name: '4. ATAK ZIMNEGO STARTU RAM (COLD-BOOT ATTACK NA WĘŹLE 0)',
    threatLevel: 'KRYTYCZNY',
    adversaryModel: 'Fizyczny napastnik włamujący się do pomieszczenia operatora zaraz po odłączeniu zasilania.',
    attackMechanism: 'Zamrożenie kości pamięci DRAM ciekłym azotem i próba zrzutu pozostałości kluczy szyfrujących.',
    successProbability: '< 0.05% (Wymaga czasu < 300 ms)',
    mitigationMechanism: 'System Tails OS / Whonix posiada zaimplementowany mechanizm aktywnego nadpisywania stron pamięci pseudolosowym szumem (RAM wipe) natychmiast po zaniku zasilania w czasie < 300 ms.',
    verificationAudit: 'Brak zrzutów pamięci (Core Dumps disabled), brak partycji swap na dyskach (NVMe fizycznie usunięte).',
  },
];

export const AttackMatrix: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('gpa');

  const scenario = ATTACK_SCENARIOS.find((s) => s.id === selectedScenarioId) || ATTACK_SCENARIOS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-bold tracking-display text-white flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-panzer-rose" />
          <span>MACIERZ ODPORNOŚCI NA WEKTORY ATAKU (STRESS TEST GPA-R)</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Symulacja 4 krytycznych scenariuszy deanonimizacji i załamania poufności z perspektywy globalnego przeciwnika.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenarios List */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          {ATTACK_SCENARIOS.map((s) => {
            const isSelected = selectedScenarioId === s.id;
            return (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all btn-press ${
                  isSelected
                    ? 'bg-panzer-rose/10 border-panzer-rose/50 text-white shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[11px] text-white truncate max-w-[240px]">{s.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    s.threatLevel === 'KRYTYCZNY' ? 'bg-panzer-rose/20 text-panzer-rose border border-panzer-rose/40' : 'bg-panzer-amber/20 text-panzer-amber border border-panzer-amber/40'
                  }`}>
                    {s.threatLevel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Sukces: <span className="text-panzer-emerald font-semibold">{s.successProbability}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Scenario Breakdown */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white tracking-display">{scenario.name}</h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-panzer-emerald/15 border border-panzer-emerald/30 text-panzer-emerald font-semibold">
              SZANSA POWODZENIA: {scenario.successProbability}
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Adversary capability */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">PROFIL I ZDOLNOŚCI ADWERSARZA:</span>
              <p className="text-slate-300 leading-relaxed">{scenario.adversaryModel}</p>
            </div>

            {/* Attack vector */}
            <div className="p-3.5 rounded-xl bg-panzer-rose/[0.04] border border-panzer-rose/20 space-y-1">
              <span className="text-panzer-rose block text-[10px] font-bold uppercase">WEKTOR ATAKU I METODA PRZEŁAMANIA:</span>
              <p className="text-slate-300 leading-relaxed">{scenario.attackMechanism}</p>
            </div>

            {/* Mitigation architecture */}
            <div className="p-3.5 rounded-xl bg-panzer-emerald/[0.04] border border-panzer-emerald/20 space-y-1">
              <span className="text-panzer-emerald block text-[10px] font-bold uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>ARCHITEKTURA MITYGACJI W PANZERNETWORKING:</span>
              </span>
              <p className="text-slate-200 leading-relaxed">{scenario.mitigationMechanism}</p>
            </div>

            {/* Laboratory verification */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1 text-[11px]">
              <span className="text-panzer-cyan font-semibold block">METODOLOGIA WERYFIKACJI AUDYTOWEJ:</span>
              <p className="text-slate-400">{scenario.verificationAudit}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
