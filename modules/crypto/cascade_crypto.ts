/**
 * PanzerNetworking Multi-Layer Cryptographic Cascade Engine (Matrioszka Model)
 * Hybrid Post-Quantum KEM + SPN + ARX Dual Symmetric Cascade
 */

import { HopInspectionData } from '../types/packet';

export interface CryptoShellInfo {
  id: number;
  name: string;
  family: 'Stego' | 'Post-Quantum' | 'ARX' | 'SPN' | 'Onion';
  algorithm: string;
  keySize: string;
  mathFoundation: string;
  formula: string;
  activeStatus: string;
  color: string;
  details: string[];
}

export const CRYPTO_SHELLS: readonly CryptoShellInfo[] = [
  {
    id: 1,
    name: 'POWŁOKA 1: KOPERTA TRANSPORTOWA & ECH',
    family: 'Stego',
    algorithm: 'TLS 1.3 Record (0x17) + Encrypted Client Hello',
    keySize: 'N/A (Outer Envelope)',
    mathFoundation: 'Rozszerzenie RFC 8446 / draft-ietf-tls-esni',
    formula: '\\text{Record} = 0x17 \\parallel 0x0303 \\parallel \\text{Len}_{1395} \\parallel \\text{Payload}',
    activeStatus: 'Widoczna dla ISP Punktu A (zanonimizowana do Anycast IP Cloudflare)',
    color: '#00f0ff',
    details: [
      'Nagłówek TLS 1.3 Application Data (0x17 0x03 0x03 0x05 0x73)',
      'Szyfrowany nagłówek Server Name Indication (ECH) uniemożliwia podgląd subdomeny',
      'Stałe wyrównanie ramki do MTU 1400 bajtów eliminuje sygnatury rozmiaru',
    ],
  },
  {
    id: 2,
    name: 'POWŁOKA 2: HYBRYDOWY KEM POSTKWANTOWY',
    family: 'Post-Quantum',
    algorithm: 'ML-KEM-1024 (FIPS 203) + X25519 ECDH',
    keySize: '1024-bit Lattice + 256-bit Elliptic Curve',
    mathFoundation: 'Kraty euklidesowe (Module Learning With Errors: M-LWE) + Krzywa Montgomery\'ego',
    formula: 'K_{\\text{master}} = \\text{HKDF-Extract}(\\text{Salt}, \\text{SS}_{X25519} \\parallel \\text{SS}_{ML-KEM})',
    activeStatus: 'Odporność na algorytm kwantowy Shora i wektor Store Now Decrypt Later',
    color: '#a855f7',
    details: [
      'Uzgadnianie kluczy sesyjnych w pierścieniu wielomianów R_q = Z_q[X]/(X^n + 1)',
      'Podwójny sekret łączony przez HKDF-SHA512 z solą kryptograficzną',
      'Nawet przy złamaniu matematyki kratowej bezpieczeństwo zachowuje poziom krzywej X25519',
    ],
  },
  {
    id: 3,
    name: 'POWŁOKA 3: SZYFR STRUMIENIOWY XCHACHA20-POLY1305',
    family: 'ARX',
    algorithm: 'XChaCha20 + Poly1305 MAC',
    keySize: '256-bit klucz, 192-bit rozszerzony Nonce',
    mathFoundation: 'Operacje ARX (Addition-Rotation-XOR) na słowach 32-bitowych',
    formula: '\\text{QuarterRound}(a, b, c, d): a \\mathrel{+}= b; d = (d \\oplus a) \\lll 16; c \\mathrel{+}= d; b = (b \\oplus c) \\lll 12',
    activeStatus: 'Zdejmowana w Węźle 3 (P2P Residential Mixnode) do weryfikacji Dummy Chaff',
    color: '#10b981',
    details: [
      'Brak tablic przeglądowych (S-Box) zapewnia niewrażliwość na ataki czasowe na pamięć cache procesora',
      '192-bitowy wektor inicjalizacyjny (IV) eliminuje ryzyko kolizji przy pseudolosowym doborze',
      'Tag uwierzytelniający Poly1305 weryfikuje integralność strumienia w Węźle 3',
    ],
  },
  {
    id: 4,
    name: 'POWŁOKA 4: SZYFR BLOKOWY AES-256-GCM',
    family: 'SPN',
    algorithm: 'AES-256 (Rijndael) + Galois Counter Mode',
    keySize: '256-bit klucz sesyjny, 96-bit IV, 128-bit Tag',
    mathFoundation: 'Sieć Podstawieniowo-Permutacyjna (SPN) w ciele Galois GF(2^8) i GF(2^128)',
    formula: '\\text{State} = \\text{AddRoundKey}(\\text{MixColumns}(\\text{ShiftRows}(\\text{SubBytes}(\\text{State}))))',
    activeStatus: 'Zdejmowana w Węźle 4 (VPS WebTunnel) przed przekazaniem do gniazda Tora',
    color: '#f59e0b',
    details: [
      '14 pełnych rund kryptograficznych z nieliniowymi podstawieniami bajtów',
      'Mnożenie w ciele Galois GF(2^128) dla natychmiastowej autentykacji GHASH',
      'Hardware\'owa akceleracja przez instrukcje procesora AES-NI',
    ],
  },
  {
    id: 5,
    name: 'POWŁOKA 5: POTRÓJNY SZYFR CEBULOWY TOR',
    family: 'Onion',
    algorithm: 'Tor 3-Hop Circuit (Guard -> Middle -> Exit)',
    keySize: 'Klucze symetryczne obwodu Tor (AES-128-CTR / Curve25519 ntor)',
    mathFoundation: 'Onion Routing (format stałych komórek 514 B)',
    formula: '\\text{Cell} = E_{K_{\\text{Guard}}}(E_{K_{\\text{Middle}}}(E_{K_{\\text{Exit}}}(\\text{HTTP Payload})))',
    activeStatus: 'Odizolowany obwód docelowy dla każdej domeny/karty (IsolateSOCKSAuth)',
    color: '#f43f5e',
    details: [
      'Komórki o stałym rozmiarze 514 bajtów z enkapsulacją wielowarstwową',
      'Żaden węzeł Tora nie zna jednocześnie tożsamości nadawcy i adresu docelowego',
      'Wyjście na serwer docelowy z czystym szyfrowaniem end-to-end TLS aplikacji',
    ],
  },
];

/**
 * Oblicza dokładną Entropię Shannona H(X) dla tablicy bajtów
 * H(X) = - SUM( P(x_i) * log2(P(x_i)) )
 */
export function calculateShannonEntropy(buffer: Uint8Array): number {
  if (!buffer || buffer.length === 0) return 0;
  
  const freq = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    freq[buffer[i]]++;
  }
  
  let entropy = 0;
  const len = buffer.length;
  for (let i = 0; i < 256; i++) {
    if (freq[i] > 0) {
      const p = freq[i] / len;
      entropy -= p * Math.log2(p);
    }
  }
  return Number(entropy.toFixed(4));
}

/**
 * Generuje heksadecymalny zrzut pamięci (Wireshark Style)
 */
export function formatHexDump(buffer: Uint8Array, maxBytes: number = 256): { hex: string; ascii: string } {
  const displayLen = Math.min(buffer.length, maxBytes);
  let hexLines: string[] = [];
  let asciiLines: string[] = [];

  for (let i = 0; i < displayLen; i += 16) {
    const chunk = buffer.slice(i, i + 16);
    const hexParts: string[] = [];
    let asciiPart = '';

    for (let j = 0; j < 16; j++) {
      if (j < chunk.length) {
        const b = chunk[j];
        hexParts.push(b.toString(16).padStart(2, '0'));
        asciiPart += (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.';
      } else {
        hexParts.push('  ');
        asciiPart += ' ';
      }
    }
    
    const offset = i.toString(16).padStart(4, '0').toUpperCase();
    hexLines.push(`${offset}  ${hexParts.slice(0, 8).join(' ')}  ${hexParts.slice(8).join(' ')}`);
    asciiLines.push(asciiPart);
  }

  return {
    hex: hexLines.join('\n'),
    ascii: asciiLines.join('\n'),
  };
}

/**
 * Generuje syntetyczną ramkę MTU 1400 B dla konkretnego przeskoku tranzytowego
 */
export function generateHopInspection(hopIndex: number, isChaff: boolean = false): HopInspectionData {
  const frame = new Uint8Array(1400);
  
  // Wypełnienie deterministyczno-pseudolosowe dla stabilnego demo
  for (let i = 0; i < 1400; i++) {
    frame[i] = (Math.sin(i * 12.9898 + hopIndex * 78.233) * 43758.5453) % 256 & 0xFF;
  }

  // Ustawienie stałego nagłówka TLS 1.3
  frame[0] = 0x17; // Application Data
  frame[1] = 0x03; // TLS 1.2/1.3 legacy
  frame[2] = 0x03;
  frame[3] = 0x05; // 1395 bajtów długości
  frame[4] = 0x73;

  // Pole typu pakietu
  frame[29] = isChaff ? 0xFF : 0x01;

  const entropy = calculateShannonEntropy(frame);
  const dump = formatHexDump(frame, 128);

  const hopConfigs: Record<number, { name: string; layer: string; shell: string; desc: string; visible: Record<string, string>; hidden: Record<string, string> }> = {
    0: {
      name: 'WĘZEŁ 0: STACJA ROBOCZA (RAM-ONLY)',
      layer: 'Host Memory / L7',
      shell: 'Kompletna Kaskada 5 Powłok (Przed emisją)',
      desc: 'Pakiet przygotowany w pamięci RAM Tails OS. Skonstruowano matrioszkę kryptograficzną.',
      visible: { 'Payload Type': isChaff ? '0xFF (Dummy Chaff)' : '0x01 (Real Tor Cell)', 'Host Environment': 'RAM-Only Whonix/Tails', 'Target Domain': 'Ukryta za 3-hop Tor' },
      hidden: { 'Ślad dyskowy': 'Brak (DRAM)', 'Adres IP ISP': 'Pominięty' },
    },
    1: {
      name: 'WĘZEŁ 1: MOST RADIOWY 60 GHz (PENCIL BEAM)',
      layer: 'OSI L1 / L2 (V-Band)',
      shell: 'Powłoka 1-5 + Tunel MACsec L2',
      desc: 'Transmisja wąskowiązkowa 60 GHz. Sygnał tłumiony przez tlen (16 dB/km), brak wycieku bocznego.',
      visible: { 'Częstotliwość': '60.48 GHz', 'Szerokość wiązki': '<1.5° (Pencil Beam)', 'L2 Encryption': 'MACsec IEEE 802.1AE' },
      hidden: { 'Ruch u domowego ISP': '0 bajtów (Cisza radiowa)', 'Docelowy IP': 'Niewidoczny' },
    },
    2: {
      name: 'WĘZEŁ 2: CHMURA ANYCAST CDN',
      layer: 'OSI L4 / L7 (Edge Worker)',
      shell: 'Powłoka 1 (TLS 1.3 + ECH)',
      desc: 'Edge Worker na adresacji Anycast. ISP widzi połączenie z Cloudflare, ale nie zna subdomeny.',
      visible: { 'Zewnętrzny IP': '104.16.x.x (Cloudflare Anycast)', 'Protokół': 'TLS 1.3 Application Data', 'SNI': 'Zaszyfrowane przez ECH' },
      hidden: { 'Wewnętrzny ładunek': 'Szyfr 256-bit (Brak kluczy na brzegu)', 'Adres Węzła 0': 'Odcięty przez Punkt A' },
    },
    3: {
      name: 'WĘZEŁ 3: WĘZEŁ MIESZAJĄCY P2P',
      layer: 'Mixnet Layer (Residential Mixnode)',
      shell: 'Powłoka 3 (XChaCha20-Poly1305) -> Zdjęta',
      desc: 'Bufor Poissona Stop-and-Go opóźnia pakiety o losowy czas delta t. Pakiety 0xFF są niszczone w RAM.',
      visible: { 'Rozmiar ramki': 'Dokładnie 1400 B (MTU)', 'Typ pakietu': isChaff ? '0xFF (Niszczony w RAM)' : '0x01 (Forward do W4)', 'Przepływność': 'Constant Bitrate (CBR)' },
      hidden: { 'Korelacja czasowa': 'Zniszczona przez rozkład Poissona', 'Docelowy serwer': 'Ukryty w warstwie Tor' },
    },
    4: {
      name: 'WĘZEŁ 4: WEBTUNNEL VPS (OFFSHORE)',
      layer: 'OSI L7 Ingress (Cover Proxy)',
      shell: 'Powłoka 4 (AES-256-GCM) -> Zdjęta',
      desc: 'Serwer Caddy/Nginx hostuje pozorną stronę WWW. Po tajnym nagłówku następuje upgrade do WebSocket i Tora.',
      visible: { 'Publiczny port': '443 (HTTPS)', 'Strona kamuflażu': 'HTTP 200 OK (Legalny blog)', 'Status sondy DPI': 'Brak detekcji sygnatury' },
      hidden: { 'Adres IP Węzła 0': 'Całkowicie niewidoczny', 'Dalsza trasa Tor': 'Szyfrowana w komórkach 514 B' },
    },
    5: {
      name: 'WĘZEŁ 5: OBWÓD TOR (GUARD -> MIDDLE -> EXIT)',
      layer: 'Onion Routing / Target Exit',
      shell: 'Powłoka 5 (Tor Onion Cells 514 B)',
      desc: 'Trójstopniowy obwód cebulowy. Serwer docelowy widzi jedynie adres IP Tor Exit Node.',
      visible: { 'IP Widoczne dla Celu': 'Tor Exit Node (np. Islandia/Niemcy)', 'Profil przeglądarki': 'Zunifikowany profil modułu Kameleon', 'End-to-End': 'TLS Serwisu' },
      hidden: { 'Adres IP Węzła 4, 3, 2, 1, 0': 'Wielokrotnie odcięte i niepowiązane', 'Tożsamość nadawcy': 'Anonimowa' },
    },
  };

  const current = hopConfigs[hopIndex] || hopConfigs[0];

  return {
    hopIndex,
    nodeName: current.name,
    osiLayer: current.layer,
    isEncrypted: hopIndex < 5,
    activeShell: current.shell,
    entropy,
    rawHex: dump.hex,
    asciiPreview: dump.ascii,
    visibleFields: current.visible,
    hiddenFields: current.hidden,
    description: current.desc,
  };
}
