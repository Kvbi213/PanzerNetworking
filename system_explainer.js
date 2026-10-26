/**
 * PanzerNetworking :: Master Explainer Controller
 * Standard: Antigravity Protocol Nano v3.2 & Apple Design Principles
 * Zero-Dependency, Pure DOM Scripting with DocumentFragment & createElement API (Strict XSS Immunity)
 */

// -------------------------------------------------------------
// 1. DATA: 6 TRANSIT NODES SPECIFICATION
// -------------------------------------------------------------
const TRANSIT_NODES = [
  {
    id: 0,
    short: "W0",
    name: "Stacja Robocza (RAM-Only Workstation)",
    layer: "OSI L7 / Sprzęt",
    hardware: "Laptop bez dysków (Tails / Whonix DRAM) + Kameleon",
    latency: "+0 ms",
    desc: "Środowisko bezdyskowych systemów operacyjnych działające wyłącznie w pamięci ulotnej DRAM. Wymontowane moduły Wi-Fi/BT, porty USB zablokowane. Wymazywanie pamięci RAM poniżej 300 ms przy utracie zasilania (Cold-Boot Mitigation).",
    visible: { "Adwersarz L0": "Brak wycieków poza zdefiniowany interfejs", "DNS / STUN": "Całkowity brak zapytań (Zero-Leak)" },
    hidden: { "Prawdziwa tożsamość": "Zabezpieczona w DRAM", "Klucze sesyjne": "Rotowane co 60 sekund (PFS)" }
  },
  {
    id: 1,
    short: "W1",
    name: "Most Radiowy 60 GHz PtP (Physical Bypass)",
    layer: "OSI L1 / L2",
    hardware: "MikroTik wAP 60G / Cube 60Pro (Wiązka <1.5°)",
    latency: "+0.8 ms",
    desc: "Fizyczne ominięcie domowego łącza operatora. Wiązka milimetrowa Pencil Beam tłumiona przez tlen (16 dB/km) uniemożliwia podsłuch z odległości powyżej kilkuset metrów. Punkt zrzutu (DropBox) zasilany solarnie z modemem pre-paid.",
    visible: { "Domowy ISP": "0 B / Brak aktywności na łączu domowym", "Skanery Wi-Fi": "Szum tła (Brak transmisji 2.4/5 GHz)" },
    hidden: { "Lokalizacja operatora": "Ukryta za mostem mikrofalowym", "Treść L2": "Szyfrowana kluczem sprzętowym" }
  },
  {
    id: 2,
    short: "W2",
    name: "Chmura Anycast CDN (Camouflage Proxy 1)",
    layer: "OSI L4 / L7",
    hardware: "Cloudflare Edge Worker / Fastly Compute (ECH TLS 1.3)",
    latency: "+15 ms",
    desc: "Bezstanowy worker brzegowy na globalnej adresacji Anycast. Dzięki Encrypted Client Hello (ECH) dostawca internetu w Punkzie A widzi jedynie połączenie do wspólnego IP Cloudflare, z którego korzystają miliony legalnych stron.",
    visible: { "ISP Punktu A": "Pakiet TLS 1.3 (1400 B) do adresu CDN Anycast", "Nagłówek SNI": "Zaszyfrowany w ECH (Niewidoczny)" },
    hidden: { "Subdomena docelowa": "Zaszyfrowana w ECH", "Ładunek": "Szyfrowany podwójną kaskadą 256-bit" }
  },
  {
    id: 3,
    short: "W3",
    name: "Węzeł Mieszający P2P (Residential Mixnode)",
    layer: "OSI L4 / Mixnet",
    hardware: "Demon Rust (Stop-and-Go Poisson Buffer + Chaff)",
    latency: "+40 ms",
    desc: "Węzeł domowy P2P implementujący bufor Stop-and-Go. Każdy pakiet jest opóźniany o czas generowany z rozkładu wykładniczego Poissona. Stałe MTU 1400 B i wstrzykiwanie pakietów pozornych (Dummy Chaff) niweczą korelację czasową GPA.",
    visible: { "Obserwator IXP": "Zaszyfrowany strumień o stałej przepływności (CBR)", "Rozmiar ramki": "Stałe 1400 B dla każdego pakietu" },
    hidden: { "Korelacja czasowa (Δt)": "Zniweczona rozkładem Poissona", "Typ pakietu": "Nierozróżnialny (Dane vs Szum Chaff)" }
  },
  {
    id: 4,
    short: "W4",
    name: "Prywatny VPS + WebTunnel (Ingress Proxy 2)",
    layer: "OSI L7 / WebSocket",
    hardware: "Serwer VPS No-KYC (Islandia/Szwajcaria) + Caddy/Nginx",
    latency: "+25 ms",
    desc: "Serwer WWW hostujący legalną witrynę z certyfikatem TLS Let's Encrypt. Żądanie z tajną ścieżką URI i nagłówkiem autoryzacyjnym inicjuje podniesienie połączenia (Connection Upgrade) do WebSocket podpiętego do demona Tor.",
    visible: { "Sondy Cenzorskie": "Zwykła strona HTML (Status 200 OK)", "Skanery Nmap": "Standardowe porty 80/443 z certyfikatem" },
    hidden: { "Obecność Tora": "Ukryta za fasadą serwera WWW", "Tożsamość nadawcy": "Ukryta za Węzłami 1, 2 i 3" }
  },
  {
    id: 5,
    short: "W5",
    name: "Obwód Cebulowy Tor (3-Hop Onion Circuit)",
    layer: "OSI L7 / Onion",
    hardware: "Tor Guard -> Middle -> Exit (Stream Isolation)",
    latency: "+150 ms",
    desc: "Trójstopniowy obwód cebulowy. Izolacja strumieni (IsolateSOCKSAuth) wymusza budowę osobnego obwodu dla każdej otwartej domeny. Serwer docelowy widzi wyłącznie zunifikowany profil przeglądarki wygenerowany przez moduł Kameleon.",
    visible: { "Tor Guard": "Połączenie przychodzące z serwera VPS (W4)", "Serwis Docelowy": "Adres IP węzła Tor Exit + profil Kameleon" },
    hidden: { "Ścieżka powrotna": "Rozbita na 5 niezależnych skoków", "Adres IP stacji": "Całkowicie niewykrywalny" }
  }
];

// -------------------------------------------------------------
// 2. DATA: CRYPTO SHELLS (MATRIOSZKA)
// -------------------------------------------------------------
const CRYPTO_SHELLS = [
  {
    id: 1,
    name: "Powłoka 1: Koperta Transportowa & Steganografia (TLS 1.3 + ECH)",
    algo: "TLS 1.3 Record (0x17) + Encrypted Client Hello",
    keysize: "Klucz sesyjny TLS ephemeral",
    math: "Kryptografia krzywych eliptycznych (X25519) + HKDF",
    formula: "Ciphertext = TLS_Encrypt(Record_Header || Payload_1400B)",
    features: ["Maskuje sygnatury protokołów VPN/Tor", "Ukrywa nazwę domeny przed ISP (ECH)", "Dopełnia ramkę do stałego MTU 1400 B"]
  },
  {
    id: 2,
    name: "Powłoka 2: Hybrydowy KEM Postkwantowy (ML-KEM-1024 + X25519)",
    algo: "NIST FIPS 203 (Kyber-1024) + Curve25519",
    keysize: "Klucz kwantowy: 256-bit security margin",
    math: "Problem kratowy Module-LWE (Kraty algebraiczne)",
    formula: "SS = HKDF-SHA512(SS_X25519 || Decaps_MLKEM(ct, sk))",
    features: ["Odporność na algorytm Shora (Q-Day Ready)", "Ochrona przed atakiem Store Now, Decrypt Later (SNDL)", "Podwójna derywacja klucza sesyjnego"]
  },
  {
    id: 3,
    name: "Powłoka 3: Szyfr Strumieniowy XChaCha20-Poly1305 (ARX)",
    algo: "XChaCha20 (256-bit) + Poly1305 MAC (128-bit)",
    keysize: "256-bitowy klucz + 192-bitowy rozszerzony nonce",
    math: "Operacje ARX (Addition, Rotation, XOR na 32 bitach)",
    formula: "C = XChaCha20(K_ChaCha, Nonce_192, Data); Tag = Poly1305(C)",
    features: ["Brak tablic S-Box (Całkowita odporność na ataki cache-timing)", "192-bitowy nonce uniemożliwia kolizje IV", "Tag Poly1305 gwarantuje integralność"]
  },
  {
    id: 4,
    name: "Powłoka 4: Szyfr Blokowy AES-256-GCM (SPN)",
    algo: "AES-256 (14 rund Rijndaela) + Galois Hash",
    keysize: "256-bitowy klucz symetryczny",
    math: "Sieć podstawieniowo-permutacyjna w ciele GF(2^8)",
    formula: "C_aes = AES_CTR(K_aes, Nonce_96, C_chacha); Tag = GHASH(H, A, C)",
    features: ["Sprzętowa akceleracja procesorowa (AES-NI)", "Uwierzytelnianie w ciele skończonym Galois GF(2^128)", "Druga niezależna warstwa kaskady symetrycznej"]
  },
  {
    id: 5,
    name: "Powłoka 5: Potrójny Szyfr Cebulowy Tor + Strumień Docelowy",
    algo: "Relay Early / Relay Data Cells (514 bajtów)",
    keysize: "Trzy niezależne klucze sesyjne (Guard, Middle, Exit)",
    math: "Wielowarstwowe obieranie cebuli kryptograficznej",
    formula: "Payload = Decrypt_Exit(Decrypt_Middle(Decrypt_Guard(Tor_Cell)))",
    features: ["Zapewnia anonimowość trasy w sieci rozproszonej", "Izolacja strumieni zapobiega korelacji między kartami", "End-to-end TLS do serwisu docelowego"]
  }
];

// -------------------------------------------------------------
// 3. DATA: KAMELEON PERSONA PROFILES
// -------------------------------------------------------------
const PERSONA_PROFILES = {
  GHOST: {
    title: "Tryb 1: GHOST / STEALTH (Niewykrywalność Antybotowa)",
    target: "Panele logowania, portale bankowe, serwisy z Cloudflare Turnstile / Akamai.",
    route: "Wyjście z czystego adresu IP (Węzeł 4 VPS / Residential Proxy) + Maskowanie profilu.",
    canvas: "Wstrzykiwanie deterministycznego mikroszumu (+0.001%) do pikseli Canvas / WebGL.",
    webrtc: "Całkowita blokada protokołu UDP na poziomie iptables (Zero WebRTC Leak).",
    keystroke: "Normalizacja interwałów wpisywania tekstu (Dwell Time wygładzony do 80 ms)."
  },
  BURNER: {
    title: "Tryb 2: BURNER / ISOLATE (Maksymalna Anonimowość)",
    target: "Jednorazowy dostęp do wrażliwych źródeł, OSINT, serwisy Onion w Darknecie.",
    route: "Pełna magistrala 6 węzłów (włącznie z Torem) na poziomie bezpieczeństwa Safest.",
    canvas: "Całkowita blokada JavaScript, WebGL, WebAudio i czcionek zdalnych.",
    webrtc: "Zablokowany interfejs sieciowy, brak obsługi multimediów.",
    keystroke: "Jednorazowa sesja w pamięci RAM — natychmiastowa destrukcja po zamknięciu karty."
  },
  MULTI_PERSONA: {
    title: "Tryb 3: MULTI-PERSONA (Separacja Tożsamości)",
    target: "Prowadzenie wielu niezależnych operacji równolegle bez ryzyka korelacji krzyżowej.",
    route: "Osobny obwód Tor (inny Exit Node) i osobny namespace kontenera dla każdej karty.",
    canvas: "Unikalne ziarno szumu renderowania przypisane indywidualnie do każdego kontenera.",
    webrtc: "Izolacja na poziomie wirtualnych przestrzeni sieciowych (Network Namespaces).",
    keystroke: "Dla systemów analityki internetowej każda karta wygląda jak inny komputer w innym kraju."
  }
};

// -------------------------------------------------------------
// 4. UI CONTROLLER: 6-NODE PIPELINE (SAFE DOM MANIPULATION)
// -------------------------------------------------------------
let currentActiveHop = 0;

function renderNodeTabs() {
  const container = document.getElementById('node-tabs-container');
  if (!container) return;

  const buttons = TRANSIT_NODES.map((node, idx) => {
    const btn = document.createElement('button');
    btn.className = `btn-tactile ${idx === currentActiveHop ? 'btn-primary' : ''}`;
    btn.style.textAlign = 'left';
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.setAttribute('aria-label', `Przełącz na węzeł ${node.short} - ${node.name}`);

    const rowTop = document.createElement('div');
    rowTop.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 2px;';

    const sShort = document.createElement('span');
    sShort.style.fontWeight = '800';
    sShort.style.color = idx === currentActiveHop ? 'var(--accent-cyan)' : '#fff';
    sShort.textContent = node.short;

    const sLayer = document.createElement('span');
    sLayer.style.fontSize = '0.65rem';
    sLayer.style.color = 'var(--text-dim)';
    sLayer.textContent = node.layer.split(' ')[0];

    rowTop.appendChild(sShort);
    rowTop.appendChild(sLayer);

    const rowDesc = document.createElement('div');
    rowDesc.style.cssText = 'font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
    rowDesc.textContent = node.name.split(' (')[0];

    btn.appendChild(rowTop);
    btn.appendChild(rowDesc);

    btn.addEventListener('click', () => {
      currentActiveHop = idx;
      renderNodeTabs();
      renderNodeDetails();
    });

    return btn;
  });

  container.replaceChildren(...buttons);
}

function renderNodeDetails() {
  const card = document.getElementById('node-details-card');
  if (!card) return;
  const n = TRANSIT_NODES[currentActiveHop];

  const headerDiv = document.createElement('div');
  headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;';

  const titleWrap = document.createElement('div');
  const tagLabel = document.createElement('div');
  tagLabel.className = 'tag-label';
  tagLabel.style.color = 'var(--accent-cyan)';
  tagLabel.textContent = `SPECYFIKACJA WĘZŁA :: HOP ${n.id}`;

  const h3 = document.createElement('h3');
  h3.style.cssText = 'font-size: 1.25rem; color: #fff;';
  h3.textContent = n.name;

  titleWrap.appendChild(tagLabel);
  titleWrap.appendChild(h3);

  const latSpan = document.createElement('span');
  latSpan.className = 'tag-label';
  latSpan.style.cssText = 'background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 8px; border-radius: 6px;';
  latSpan.textContent = `LATENCJA RTT: ${n.latency}`;

  headerDiv.appendChild(titleWrap);
  headerDiv.appendChild(latSpan);

  const descP = document.createElement('p');
  descP.style.cssText = 'color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem; line-height: 1.6;';
  descP.textContent = n.desc;

  const gridDiv = document.createElement('div');
  gridDiv.className = 'grid-2';
  gridDiv.style.cssText = 'margin-bottom: 1.25rem; font-family: var(--font-mono); font-size: 0.75rem;';

  // Box 1 - Co widzi obserwator
  const b1 = document.createElement('div');
  b1.style.cssText = 'background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 10px; border: 1px solid var(--border-subtle);';
  const b1Title = document.createElement('div');
  b1Title.style.cssText = 'color: var(--accent-amber); font-weight: 700; margin-bottom: 0.5rem;';
  b1Title.textContent = 'CO REJESTRUJE OBSERWATOR NA TYM ETAPIE:';
  b1.appendChild(b1Title);

  for (const [k, v] of Object.entries(n.visible)) {
    const row = document.createElement('div');
    const sk = document.createElement('span');
    sk.style.color = 'var(--text-dim)';
    sk.textContent = `${k}: `;
    const sv = document.createElement('span');
    sv.style.color = '#cbd5e1';
    sv.textContent = v;
    row.appendChild(sk);
    row.appendChild(sv);
    b1.appendChild(row);
  }

  // Box 2 - Czego nie jest w stanie ustalic
  const b2 = document.createElement('div');
  b2.style.cssText = 'background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 10px; border: 1px solid var(--border-subtle);';
  const b2Title = document.createElement('div');
  b2Title.style.cssText = 'color: var(--accent-emerald); font-weight: 700; margin-bottom: 0.5rem;';
  b2Title.textContent = 'CZEGO MATEMATYCZNIE NIE JEST W STANIE USTALIĆ:';
  b2.appendChild(b2Title);

  for (const [k, v] of Object.entries(n.hidden)) {
    const row = document.createElement('div');
    const sk = document.createElement('span');
    sk.style.color = 'var(--text-dim)';
    sk.textContent = `${k}: `;
    const sv = document.createElement('span');
    sv.style.color = 'var(--accent-emerald)';
    sv.textContent = v;
    row.appendChild(sk);
    row.appendChild(sv);
    b2.appendChild(row);
  }

  gridDiv.appendChild(b1);
  gridDiv.appendChild(b2);

  const footerDiv = document.createElement('div');
  footerDiv.style.cssText = 'font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);';

  const spanHwLabel = document.createElement('span');
  spanHwLabel.textContent = 'ŚRODOWISKO SPRZĘTOWE: ';
  const spanHwVal = document.createElement('span');
  spanHwVal.style.color = '#fff';
  spanHwVal.textContent = n.hardware;

  const spanSep = document.createElement('span');
  spanSep.textContent = ' | ';

  const spanLyrLabel = document.createElement('span');
  spanLyrLabel.textContent = 'WARSTWA OSI: ';
  const spanLyrVal = document.createElement('span');
  spanLyrVal.style.color = 'var(--accent-cyan)';
  spanLyrVal.textContent = n.layer;

  footerDiv.appendChild(spanHwLabel);
  footerDiv.appendChild(spanHwVal);
  footerDiv.appendChild(spanSep);
  footerDiv.appendChild(spanLyrLabel);
  footerDiv.appendChild(spanLyrVal);

  card.replaceChildren(headerDiv, descP, gridDiv, footerDiv);
}

// -------------------------------------------------------------
// 5. UI CONTROLLER: WIRESHARK LIVE HEX DUMP & DISSECTOR (1400 B)
// -------------------------------------------------------------
let isChaffFrame = false;
let activeFrameField = 'tls';
let cachedFrameRandomBytes = null;

const FRAME_FIELDS = {
  tls: {
    name: "Nagłówek Rekordu TLS 1.3 (Application Data)",
    offset: "0x0000 - 0x0004 (5 bajtów)",
    hex: "17 03 03 05 73",
    visibility: "Jawny dla systemów NGFW / DPI",
    role: "Kamuflaż steganograficzny: ramka udaje standardowy strumień HTTPS. Brak sygnatur uścisków dłoni WireGuard lub obfs4.",
    color: "var(--accent-cyan)"
  },
  nonce: {
    name: "Rozszerzony Wektor Inicjalizacyjny XChaCha20 Nonce",
    offset: "0x0005 - 0x001C (24 bajty = 192 bity)",
    hex: "9f 4a 12 bc e7 31 88 5d 02 aa 7e 19 41 ff 28 6b c0 84 33 e1 50 92 ad 14",
    visibility: "Pseudolosowy (Nierozróżnialny od szyfrogramu TLS)",
    role: "Rozszerzony nonce 192-bitowy całkowicie eliminuje ryzyko powtórzenia IV przy pracy ciągłej 1 Gbps.",
    color: "var(--accent-emerald)"
  },
  inner: {
    name: "Zaszyfrowany Nagłówek Wewnętrzny Ramki",
    offset: "0x001D - 0x0020 (4 bajty)",
    hex: "01 05 2a 00",
    visibility: "Szyfrowany w warstwie XChaCha20 + AES-256-GCM",
    role: "Oznacza typ pakietu: 0x01 (prawdziwe dane) vs 0xFF (szum Dummy Chaff) oraz długość ładunku bez wycieku do DPI.",
    color: "var(--accent-amber)"
  },
  payload: {
    name: "Szyfrowany Ładunek AES-256-GCM + Losowy Padding Wyrównujący",
    offset: "0x0021 - 0x055F (1335 bajtów)",
    hex: "54 6f 72 20 43 65 6c 6c 73 20 28 35 31 34 20 42 29 20 2b 20 50 61 64 64 69 6e 67...",
    visibility: "Potrójnie szyfrowany (Tor + AES + XChaCha20)",
    role: "Wyrównanie do stałego MTU 1400 B zapewnia Constant Bitrate (CBR), niwecząc ataki korelacji rozmiaru pakietów.",
    color: "var(--accent-purple)"
  },
  mac: {
    name: "Podwójne Tagi Uwierzytelniania Integralności (AEAD)",
    offset: "0x0560 - 0x057F (32 bajty)",
    hex: "Tag AES-GCM (16 B): 7a 1b 88... | Tag Poly1305 (16 B): 44 f2 90...",
    visibility: "Tagi kryptograficzne",
    role: "Uwierzytelnienie w ciele Galois GF(2^128) dla Węzła 4 oraz Poly1305 dla Węzła 3. Każda modyfikacja pakietu przez NGFW powoduje natychmiastowy cichy drop.",
    color: "var(--accent-rose)"
  }
};

function generateRandomByteHex() {
  const hexChars = "0123456789abcdef";
  return hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
}

function validateFieldSpecs() {
  try {
    const specs = { tls: 5, nonce: 24, inner: 4, mac: 32 };
    if (!specs || typeof specs !== 'object') return false;
    const headerTotal = Number(specs.tls || 0) + Number(specs.nonce || 0) + Number(specs.inner || 0) + Number(specs.mac || 0);
    if (headerTotal !== 65) {
      console.error(`[!] BŁĄD INTEGRALNOŚCI: Suma nagłówków wynosi ${headerTotal} B zamiast 65 B`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[!] BŁĄD WALIDACJI nagłówków: ${err ? err.message : String(err)}`);
    return false;
  }
}

function generateFrameData(isChaff) {
  try {
    if (!validateFieldSpecs()) {
      return { hex: 'ERROR: Niezgodność specyfikacji nagłówków ramki 1400 B', ascii: '|ERROR|' };
    }
    const hexLines = [];
    const asciiLines = [];

    if (!Array.isArray(cachedFrameRandomBytes) || cachedFrameRandomBytes.length !== 128) {
      cachedFrameRandomBytes = [];
      for (let i = 0; i < 128; i++) {
        cachedFrameRandomBytes.push(generateRandomByteHex());
      }
    }

    for (let row = 0; row < 8; row++) {
      const offset = (row * 16).toString(16).padStart(4, '0');
      const bytes = [];
      let ascii = "";

      for (let col = 0; col < 16; col++) {
        const byteIdx = row * 16 + col;
        let bHex = cachedFrameRandomBytes[byteIdx] || "00";

        if (byteIdx === 0) bHex = "17"; // TLS 1.3 Application Data
        else if (byteIdx === 1) bHex = "03"; // TLS Major
        else if (byteIdx === 2) bHex = "03"; // TLS Minor
        else if (byteIdx === 3) bHex = "05"; // Length high
        else if (byteIdx === 4) bHex = "73"; // Length low (1395 B)
        else if (byteIdx === 28) bHex = isChaff ? "ff" : "01"; // Inner Packet Type
        else if (byteIdx === 29) bHex = "05"; // Payload length high
        else if (byteIdx === 30) bHex = "2a"; // Payload length low

        bytes.push(bHex);
        const bVal = parseInt(bHex, 16);
        ascii += (bVal >= 32 && bVal <= 126) ? String.fromCharCode(bVal) : ".";
      }

      hexLines.push(`${offset}  ${bytes.slice(0, 8).join(' ')}  ${bytes.slice(8).join(' ')}`);
      asciiLines.push(`|${ascii}|`);
    }

    return { hex: hexLines.join('\n'), ascii: asciiLines.join('\n') };
  } catch (err) {
    console.error('[!] Błąd generowania ramki Wireshark:', err);
    return { hex: '0000  17 03 03 05 73 [BŁĄD PARSOWANIA]', ascii: '|.....|' };
  }
}

function renderFrameFieldInspector(fieldKey) {
  activeFrameField = fieldKey;
  const f = FRAME_FIELDS[fieldKey] || FRAME_FIELDS.tls;
  const inspector = document.getElementById('frame-field-inspector');
  if (!inspector) return;

  const topRow = document.createElement('div');
  topRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;';

  const titleWrap = document.createElement('div');
  const tag = document.createElement('span');
  tag.className = 'tag-label';
  tag.style.cssText = `color: ${f.color}; margin-right: 0.5rem;`;
  tag.textContent = 'WYBRANY SEGMENT RAMKI';

  const strongTitle = document.createElement('strong');
  strongTitle.style.cssText = 'color: #ffffff; font-size: 0.85rem;';
  strongTitle.textContent = f.name;

  titleWrap.appendChild(tag);
  titleWrap.appendChild(strongTitle);

  const offsetBadge = document.createElement('span');
  offsetBadge.className = 'tag-label';
  offsetBadge.style.cssText = `background: rgba(255, 255, 255, 0.08); color: ${f.color}; border: 1px solid ${f.color}; padding: 2px 6px; border-radius: 4px;`;
  offsetBadge.textContent = f.offset;

  topRow.appendChild(titleWrap);
  topRow.appendChild(offsetBadge);

  const grid = document.createElement('div');
  grid.className = 'grid-2';
  grid.style.cssText = 'gap: 0.75rem; margin-top: 0.5rem;';

  const col1 = document.createElement('div');
  col1.style.cssText = 'background: rgba(0, 0, 0, 0.4); padding: 0.6rem; border-radius: 6px; border: 1px solid var(--border-subtle);';
  const roleLabel = document.createElement('div');
  roleLabel.style.cssText = 'color: var(--text-dim); font-size: 0.7rem; margin-bottom: 2px;';
  roleLabel.textContent = 'FUNKCJA ARCHITEKTONICZNA:';
  const roleText = document.createElement('div');
  roleText.style.cssText = 'color: #e2e8f0; font-size: 0.75rem; line-height: 1.4;';
  roleText.textContent = f.role;
  col1.appendChild(roleLabel);
  col1.appendChild(roleText);

  const col2 = document.createElement('div');
  col2.style.cssText = 'background: rgba(0, 0, 0, 0.4); padding: 0.6rem; border-radius: 6px; border: 1px solid var(--border-subtle);';
  const visLabel = document.createElement('div');
  visLabel.style.cssText = 'color: var(--text-dim); font-size: 0.7rem; margin-bottom: 2px;';
  visLabel.textContent = 'WIDOCZNOŚĆ DLA CENSOR/DPI:';
  const visText = document.createElement('div');
  visText.style.cssText = `color: ${f.color}; font-size: 0.75rem; font-weight: 700; line-height: 1.4;`;
  visText.textContent = f.visibility;
  col2.appendChild(visLabel);
  col2.appendChild(visText);

  grid.appendChild(col1);
  grid.appendChild(col2);

  inspector.replaceChildren(topRow, grid);

  // Update active state in diagram
  document.querySelectorAll('.frame-block').forEach(block => {
    const bField = block.getAttribute('data-field');
    if (bField === fieldKey) {
      block.classList.add('active');
    } else {
      block.classList.remove('active');
    }
  });
}

function updateWiresharkDump() {
  const data = generateFrameData(isChaffFrame);
  const hexEl = document.getElementById('raw-hex-dump');
  const asciiEl = document.getElementById('raw-ascii-dump');
  if (hexEl) hexEl.textContent = data.hex;
  if (asciiEl) asciiEl.textContent = data.ascii;
}

function initWiresharkDissector() {
  updateWiresharkDump();
  renderFrameFieldInspector(activeFrameField);

  const togglePayloadBtn = document.getElementById('btn-toggle-payload-type');
  if (togglePayloadBtn) {
    togglePayloadBtn.addEventListener('click', () => {
      isChaffFrame = !isChaffFrame;
      if (isChaffFrame) {
        togglePayloadBtn.textContent = "TYP ŁADUNKU: 0xFF (DUMMY CHAFF)";
        togglePayloadBtn.style.color = "var(--accent-amber)";
        togglePayloadBtn.style.borderColor = "rgba(245, 158, 11, 0.5)";
      } else {
        togglePayloadBtn.textContent = "TYP ŁADUNKU: 0x01 (DANE REALNE)";
        togglePayloadBtn.style.color = "var(--accent-cyan)";
        togglePayloadBtn.style.borderColor = "rgba(0, 240, 255, 0.4)";
      }
      if (FRAME_FIELDS.inner) {
        FRAME_FIELDS.inner.hex = isChaffFrame ? "ff 05 2a 00" : "01 05 2a 00";
      }
      updateWiresharkDump();
      if (activeFrameField === 'inner') {
        renderFrameFieldInspector('inner');
      }
    });
  }

  const resampleBtn = document.getElementById('btn-resample-frame');
  if (resampleBtn) {
    resampleBtn.addEventListener('click', () => {
      cachedFrameRandomBytes = null;
      updateWiresharkDump();
    });
  }

  document.querySelectorAll('.frame-block').forEach(block => {
    block.addEventListener('click', () => {
      const fieldKey = block.getAttribute('data-field');
      if (fieldKey) renderFrameFieldInspector(fieldKey);
    });
  });
}

// -------------------------------------------------------------
// 6. UI CONTROLLER: CRYPTO SHELL INSPECTOR (SAFE DOM)
// -------------------------------------------------------------
let activeShellId = 3;

function renderCryptoShell(shellId) {
  activeShellId = shellId;
  const s = CRYPTO_SHELLS.find(item => item.id === shellId) || CRYPTO_SHELLS[2];
  const card = document.getElementById('crypto-inspector-card');
  if (!card) return;

  const tag = document.createElement('div');
  tag.className = 'tag-label';
  tag.style.cssText = 'color: var(--accent-purple); margin-bottom: 0.25rem;';
  tag.textContent = 'POWŁOKA KASKADY (MATRIOSZKA)';

  const h3 = document.createElement('h3');
  h3.style.cssText = 'font-size: 1.15rem; color: #fff; margin-bottom: 0.75rem;';
  h3.textContent = s.name;

  const metaDiv = document.createElement('div');
  metaDiv.style.cssText = 'font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); space-y: 0.5rem; margin-bottom: 1rem;';

  const rows = [
    { label: 'Algorytm:', val: s.algo },
    { label: 'Rozmiar Klucza:', val: s.keysize },
    { label: 'Fundament Matematyczny:', val: s.math }
  ];
  rows.forEach(r => {
    const row = document.createElement('div');
    row.style.marginBottom = '4px';
    const strong = document.createElement('strong');
    strong.style.color = '#fff';
    strong.textContent = `${r.label} `;
    row.appendChild(strong);
    row.appendChild(document.createTextNode(r.val));
    metaDiv.appendChild(row);
  });

  const formulaBox = document.createElement('div');
  formulaBox.style.cssText = 'background: rgba(0,0,0,0.5); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan); overflow-x: auto; margin-bottom: 1rem;';
  const code = document.createElement('code');
  code.textContent = s.formula;
  formulaBox.appendChild(code);

  const featsWrap = document.createElement('div');
  featsWrap.style.cssText = 'font-family: var(--font-mono); font-size: 0.75rem;';
  const featsTitle = document.createElement('div');
  featsTitle.style.cssText = 'color: var(--accent-emerald); font-weight: 700; margin-bottom: 0.4rem;';
  featsTitle.textContent = 'GWARANCJE BEZPIECZEŃSTWA:';
  featsWrap.appendChild(featsTitle);

  const ul = document.createElement('ul');
  ul.style.cssText = 'list-style: none; padding-left: 0;';
  s.features.forEach(f => {
    const li = document.createElement('li');
    li.style.cssText = 'margin-bottom: 4px; color: var(--text-muted);';
    const icon = document.createElement('span');
    icon.style.color = 'var(--accent-emerald)';
    icon.textContent = '[+] ';
    li.appendChild(icon);
    li.appendChild(document.createTextNode(f));
    ul.appendChild(li);
  });
  featsWrap.appendChild(ul);

  card.replaceChildren(tag, h3, metaDiv, formulaBox, featsWrap);

  // Update concentric circles highlight & glow
  document.querySelectorAll('.crypto-circle').forEach(c => {
    const cId = parseInt(c.getAttribute('data-shell'));
    if (cId === shellId) {
      c.setAttribute('stroke-width', '5');
      c.style.opacity = '1';
      c.style.filter = 'drop-shadow(0 0 8px currentColor)';
    } else {
      c.setAttribute('stroke-width', '2');
      c.style.opacity = '0.7';
      c.style.filter = 'none';
    }
  });

  // Update shell buttons highlight
  document.querySelectorAll('.shell-btn').forEach(btn => {
    const bId = parseInt(btn.getAttribute('data-shell'));
    if (bId === shellId) {
      btn.classList.add('active', 'btn-primary');
    } else {
      btn.classList.remove('active', 'btn-primary');
    }
  });
}

document.querySelectorAll('.shell-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const id = parseInt(e.currentTarget.getAttribute('data-shell'));
    renderCryptoShell(id);
  });
});

document.querySelectorAll('.crypto-circle').forEach(circle => {
  circle.addEventListener('click', (e) => {
    const id = parseInt(e.currentTarget.getAttribute('data-shell'));
    renderCryptoShell(id);
  });
});

// -------------------------------------------------------------
// 7. UI CONTROLLER: KAMELEON PERSONA ENGINE (SAFE DOM)
// -------------------------------------------------------------
function renderPersona(mode) {
  const p = PERSONA_PROFILES[mode] || PERSONA_PROFILES.GHOST;
  const card = document.getElementById('persona-details-card');
  if (!card) return;

  const h3 = document.createElement('h3');
  h3.style.cssText = 'font-size: 1.15rem; color: var(--accent-amber); margin-bottom: 0.5rem;';
  h3.textContent = p.title;

  const targetP = document.createElement('p');
  targetP.style.cssText = 'font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;';
  targetP.textContent = p.target;

  const gridDiv = document.createElement('div');
  gridDiv.className = 'grid-2';
  gridDiv.style.cssText = 'font-family: var(--font-mono); font-size: 0.75rem;';

  const cards = [
    { title: 'Trasa i IP Wyjściowe:', text: p.route },
    { title: 'Maskowanie Canvas & WebGL:', text: p.canvas },
    { title: 'Blokada WebRTC & DNS Leak:', text: p.webrtc },
    { title: 'Biometria Pisania (Keystroke):', text: p.keystroke }
  ];

  cards.forEach(c => {
    const box = document.createElement('div');
    box.style.cssText = 'background: rgba(0,0,0,0.4); padding: 0.85rem; border-radius: 8px; border: 1px solid var(--border-subtle);';
    const strong = document.createElement('strong');
    strong.style.color = '#fff';
    strong.textContent = c.title;
    const bodyP = document.createElement('p');
    bodyP.style.cssText = 'color: var(--text-muted); margin-top: 4px;';
    bodyP.textContent = c.text;
    box.appendChild(strong);
    box.appendChild(bodyP);
    gridDiv.appendChild(box);
  });

  card.replaceChildren(h3, targetP, gridDiv);
}

document.querySelectorAll('.persona-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('active', 'btn-primary'));
    e.currentTarget.classList.add('active', 'btn-primary');
    const mode = e.currentTarget.getAttribute('data-persona');
    renderPersona(mode);
  });
});

// -------------------------------------------------------------
// 8. UI CONTROLLER: SHANNON ENTROPY & 60 GHz CALCULATORS
// -------------------------------------------------------------
function calculateShannonEntropy(rawText) {
  try {
    const text = String(rawText || '').slice(0, 50000);
    if (!text || text.length === 0) return 0;
    const freq = {};
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      freq[char] = (freq[char] || 0) + 1;
    }
    let entropy = 0;
    const len = text.length;
    for (const char in freq) {
      const p = freq[char] / len;
      entropy -= p * Math.log2(p);
    }
    return Number.isFinite(entropy) ? entropy : 0;
  } catch (err) {
    console.error('[!] Błąd obliczania entropii Shannona:', err);
    return 0;
  }
}

function updateEntropyDisplay(val) {
  try {
    const display = document.getElementById('entropy-value-display');
    const verdict = document.getElementById('entropy-verdict-display');
    if (display) display.textContent = `${val.toFixed(4)} b/B`;

    if (verdict) {
      if (val >= 7.99) {
        verdict.textContent = "[+] STATUS: SZUM BIAŁY (NIEWYKRYWALNY DLA DPI)";
        verdict.style.color = "var(--accent-emerald)";
        verdict.style.borderColor = "rgba(16, 185, 129, 0.3)";
        verdict.style.background = "rgba(16, 185, 129, 0.15)";
      } else if (val >= 6.0) {
        verdict.textContent = "[!] STATUS: ŚREDNIA ENTROPIA (WYKRYWALNA STRUKTURA)";
        verdict.style.color = "var(--accent-amber)";
        verdict.style.borderColor = "rgba(245, 158, 11, 0.3)";
        verdict.style.background = "rgba(245, 158, 11, 0.15)";
      } else {
        verdict.textContent = "[!] STATUS: NISKA ENTROPIA (JAWNY TEKST / BŁĄD)";
        verdict.style.color = "var(--accent-rose)";
        verdict.style.borderColor = "rgba(244, 63, 94, 0.3)";
        verdict.style.background = "rgba(244, 63, 94, 0.15)";
      }
    }
  } catch (err) {
    console.error('[!] Błąd aktualizacji widoku entropii:', err);
  }
}

function update60GhzCalculations(distanceKm) {
  try {
    const d = (Number.isFinite(distanceKm) && distanceKm >= 0.05 && distanceKm <= 3.0) ? distanceKm : 0.25;
    const distLabel = document.getElementById('dist-label');
    if (distLabel) distLabel.textContent = `${d.toFixed(2)} km (${Math.round(d * 1000)} m)`;

    // FSPL at 60 GHz: 92.45 + 20*log10(60) + 20*log10(d) = 128.01 + 20*log10(d)
    const fspl = 128.01 + 20 * Math.log10(d);
    const o2Loss = 16.0 * d;
    const totalLoss = fspl + o2Loss;

    const attDisplay = document.getElementById('attenuation-display');
    const o2Label = document.getElementById('o2-loss-label');
    const fsplLabel = document.getElementById('fspl-loss-label');

    if (attDisplay) attDisplay.textContent = `-${totalLoss.toFixed(1)} dB`;
    if (o2Label) o2Label.textContent = `${o2Loss.toFixed(1)} dB`;
    if (fsplLabel) fsplLabel.textContent = `${fspl.toFixed(1)} dB`;
  } catch (err) {
    console.error('[!] Błąd obliczeń bilansu łącza 60 GHz:', err);
  }
}

function initCalculators() {
  const entropyCalcBtn = document.getElementById('btn-entropy-calc');
  if (entropyCalcBtn) {
    entropyCalcBtn.addEventListener('click', () => {
      const input = document.getElementById('entropy-input');
      const text = input ? input.value : '';
      const h = calculateShannonEntropy(text);
      updateEntropyDisplay(h);
    });
  }

  const entropyMockBtn = document.getElementById('btn-entropy-mock');
  if (entropyMockBtn) {
    entropyMockBtn.addEventListener('click', () => {
      // Generate authentic high-entropy byte sequence across 256 byte states
      let mock = "";
      if (window.crypto && window.crypto.getRandomValues) {
        const randomBytes = new Uint8Array(2048);
        window.crypto.getRandomValues(randomBytes);
        for (let i = 0; i < randomBytes.length; i++) {
          mock += String.fromCharCode(randomBytes[i]);
        }
      } else {
        for (let i = 0; i < 2048; i++) {
          mock += String.fromCharCode(Math.floor(Math.random() * 256));
        }
      }
      const input = document.getElementById('entropy-input');
      if (input) input.value = mock;
      const h = calculateShannonEntropy(mock);
      updateEntropyDisplay(h);
    });
  }

  const distSlider = document.getElementById('dist-slider');
  if (distSlider) {
    distSlider.addEventListener('input', (e) => {
      update60GhzCalculations(parseFloat(e.target.value));
    });
    // Sync initial state
    update60GhzCalculations(parseFloat(distSlider.value));
  }

  // Initial entropy sample
  const entropyInput = document.getElementById('entropy-input');
  if (entropyInput) {
    if (!entropyInput.value) {
      // Default to 1400 B high-entropy mock
      let initialMock = "";
      for (let i = 0; i < 1400; i++) {
        initialMock += String.fromCharCode(Math.floor(Math.random() * 256));
      }
      entropyInput.value = initialMock;
      const h = calculateShannonEntropy(initialMock);
      updateEntropyDisplay(h);
    } else {
      updateEntropyDisplay(calculateShannonEntropy(entropyInput.value));
    }
  }
}

// -------------------------------------------------------------
// 9. UI CONTROLLER: 60 FPS PARTICLE PHYSICS CANVAS
// -------------------------------------------------------------
const canvas = document.getElementById('physics-canvas');
let ctx = null;
let simPaused = false;
let simPPS = 24;
let simLambda = 25;
let particles = [];
let dpiProbes = [];
let defenseFlashes = [];
let particleIdSeq = 1;
let lastSimTime = performance.now();
let simSpawnTimer = 0;
let simAnimId = null;
let dpiDefenseActiveTimer = 0;

if (canvas) {
  ctx = canvas.getContext('2d');
}

function resizeSimCanvas() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
}

if (canvas) {
  window.addEventListener('resize', resizeSimCanvas);
  resizeSimCanvas();
}

function getSimNodePositions() {
  if (!canvas) return [];
  const rect = canvas.getBoundingClientRect();
  const step = rect.width / 7;
  const y = rect.height * 0.55;
  return [
    { x: step * 1, y, label: "W0: Stacja" },
    { x: step * 2, y, label: "W1: 60GHz" },
    { x: step * 3, y, label: "W2: Anycast" },
    { x: step * 4, y, label: "W3: Poisson" },
    { x: step * 5, y, label: "W4: WebTunnel" },
    { x: step * 6, y, label: "W5: Exit" },
  ];
}

function simLoop(currentTime) {
  if (!canvas || !ctx || document.hidden) {
    simAnimId = null;
    return;
  }

  const delta = Math.min(0.1, (currentTime - lastSimTime) / 1000);
  lastSimTime = currentTime;

  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  const nodes = getSimNodePositions();
  if (nodes.length < 6) return;

  // Draw main transit line
  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x, nodes[i].y);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Spawning normal transit particles
  if (!simPaused) {
    simSpawnTimer += delta;
    const interval = 1 / Math.max(1, simPPS);
    if (simSpawnTimer >= interval) {
      simSpawnTimer = 0;
      const isChaff = Math.random() < 0.4;
      particles.push({
        id: particleIdSeq++,
        x: nodes[0].x,
        y: nodes[0].y,
        targetX: nodes[1].x,
        targetY: nodes[1].y,
        speed: 180 + Math.random() * 40,
        currentNode: 0,
        isChaff,
        inBuffer: false,
        delayRemaining: 0,
        size: isChaff ? 3 : 4
      });
    }
  }

  // Update & render regular transit particles
  particles = particles.filter(p => {
    if (simPaused) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.isChaff ? "#f59e0b" : "#00f0ff";
      ctx.fill();
      return true;
    }

    if (p.inBuffer) {
      p.delayRemaining -= delta * 1000;
      const angle = (currentTime / 200) + p.id;
      p.x = nodes[3].x + Math.cos(angle) * 20;
      p.y = nodes[3].y + Math.sin(angle) * 20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.isChaff ? "#f59e0b" : "#00f0ff";
      ctx.fill();

      if (p.delayRemaining <= 0) {
        p.inBuffer = false;
        if (p.isChaff && Math.random() < 0.5) return false; // Chaff destroyed
        p.currentNode = 3;
        p.targetX = nodes[4].x;
        p.targetY = nodes[4].y;
      }
      return true;
    }

    const dx = p.targetX - p.x;
    const dy = p.targetY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 4) {
      p.currentNode++;
      if (p.currentNode === 3) {
        p.inBuffer = true;
        // Exponential distribution sampling (Poisson process)
        p.delayRemaining = -Math.log(1.0 - Math.random()) * simLambda;
      } else if (p.currentNode >= nodes.length - 1) {
        return false;
      } else {
        p.targetX = nodes[p.currentNode + 1].x;
        p.targetY = nodes[p.currentNode + 1].y;
      }
    } else {
      p.x += (dx / dist) * p.speed * delta;
      p.y += (dy / dist) * p.speed * delta;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.isChaff ? "#f59e0b" : "#00f0ff";
    ctx.shadowColor = p.isChaff ? "#f59e0b" : "#00f0ff";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    return true;
  });

  // Update & render active adversary DPI probes
  dpiProbes = dpiProbes.filter(probe => {
    if (simPaused) {
      ctx.beginPath();
      ctx.arc(probe.x, probe.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#f43f5e";
      ctx.fill();
      return true;
    }

    const targetNode = nodes[probe.targetNodeIndex];
    if (!targetNode) return false;

    const dx = targetNode.x - probe.x;
    const dy = targetNode.y - probe.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 6) {
      // Trigger camouflage defense flash
      defenseFlashes.push({
        x: targetNode.x,
        y: targetNode.y,
        radius: 10,
        maxRadius: 36,
        alpha: 1.0,
        color: "#10b981"
      });
      dpiDefenseActiveTimer = 2.5;
      return false; // Probe deflected by 200 OK
    }

    probe.x += (dx / dist) * probe.speed * delta;
    probe.y += (dy / dist) * probe.speed * delta;

    // Draw pulsating probe with scanner cone
    ctx.beginPath();
    ctx.arc(probe.x, probe.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#f43f5e";
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    return true;
  });

  // Render defense flashes (camouflage deflection waves)
  defenseFlashes = defenseFlashes.filter(flash => {
    flash.radius += 40 * delta;
    flash.alpha -= 1.2 * delta;
    if (flash.alpha <= 0) return false;

    ctx.beginPath();
    ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(16, 185, 129, ${flash.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    return true;
  });

  // Draw active defense status banner on canvas
  if (dpiDefenseActiveTimer > 0) {
    dpiDefenseActiveTimer -= delta;
    ctx.font = "bold 11px -apple-system, monospace";
    ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText("[+] SONDA DPI ZNEUTRALIZOWANA: W2 (ECH SNI) & W4 (NGINX 200 OK)", rect.width * 0.5, 32);
  }

  // Draw transit nodes
  nodes.forEach((n, idx) => {
    const isBuffer = idx === 3;
    const isTargeted = idx === 2 || idx === 4;

    ctx.beginPath();
    ctx.arc(n.x, n.y, isBuffer ? 26 : 18, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(13, 19, 31, 0.95)";
    ctx.strokeStyle = isBuffer ? "#a855f7" : (isTargeted && dpiDefenseActiveTimer > 0 ? "#10b981" : "rgba(255, 255, 255, 0.2)");
    ctx.lineWidth = isBuffer || (isTargeted && dpiDefenseActiveTimer > 0) ? 2 : 1.5;
    ctx.fill();
    ctx.stroke();

    ctx.font = "10px -apple-system, monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(n.label, n.x, n.y + (isBuffer ? 42 : 32));
  });

  simAnimId = requestAnimationFrame(simLoop);
}

function startSim() {
  if (!simAnimId && canvas && ctx) {
    lastSimTime = performance.now();
    simAnimId = requestAnimationFrame(simLoop);
  }
}

function stopSim() {
  if (simAnimId) {
    cancelAnimationFrame(simAnimId);
    simAnimId = null;
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopSim();
  } else {
    startSim();
  }
});

window.addEventListener('beforeunload', () => {
  stopSim();
});

const pauseBtn = document.getElementById('sim-btn-pause');
if (pauseBtn) {
  pauseBtn.addEventListener('click', (e) => {
    simPaused = !simPaused;
    lastSimTime = performance.now();
    e.currentTarget.textContent = simPaused ? "WZNÓW" : "WSTRZYMAJ";
  });
}

const chaffBtn = document.getElementById('sim-btn-chaff');
if (chaffBtn) {
  chaffBtn.addEventListener('click', () => {
    const nodes = getSimNodePositions();
    if (nodes.length < 2) return;
    for (let i = 0; i < 25; i++) {
      particles.push({
        id: particleIdSeq++,
        x: nodes[0].x + (Math.random() - 0.5) * 12,
        y: nodes[0].y + (Math.random() - 0.5) * 8,
        targetX: nodes[1].x,
        targetY: nodes[1].y,
        speed: 190 + Math.random() * 50,
        currentNode: 0,
        isChaff: true,
        inBuffer: false,
        delayRemaining: 0,
        size: 3
      });
    }
  });
}

const dpiBtn = document.getElementById('sim-btn-dpi');
if (dpiBtn) {
  dpiBtn.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.textContent = "SONDA DPI W TOKU (SKANOWANIE W2/W4)...";
    btn.style.background = "rgba(244, 63, 94, 0.25)";
    btn.style.borderColor = "var(--accent-rose)";

    const nodes = getSimNodePositions();
    if (nodes.length >= 5) {
      // Spawn adversary probes targeting W2 (Node 2) and W4 (Node 4)
      dpiProbes.push(
        { x: nodes[2].x, y: 15, targetNodeIndex: 2, speed: 170 },
        { x: nodes[4].x, y: 15, targetNodeIndex: 4, speed: 170 }
      );
    }

    setTimeout(() => {
      btn.textContent = "SONDA DPI ZABLOKOWANA (200 OK)";
      btn.style.background = "rgba(16, 185, 129, 0.2)";
      btn.style.borderColor = "var(--accent-emerald)";
      btn.style.color = "var(--accent-emerald)";
      setTimeout(() => {
        btn.textContent = "SONDA DPI PROBE";
        btn.style.background = "transparent";
        btn.style.borderColor = "rgba(244, 63, 94, 0.4)";
        btn.style.color = "var(--accent-rose)";
      }, 2000);
    }, 1500);
  });
}

const ppsSlider = document.getElementById('pps-slider');
if (ppsSlider) {
  ppsSlider.addEventListener('input', (e) => {
    simPPS = parseInt(e.target.value);
    const label = document.getElementById('pps-val-label');
    if (label) label.textContent = `${simPPS} PPS`;
  });
}

const lambdaSlider = document.getElementById('lambda-slider');
if (lambdaSlider) {
  lambdaSlider.addEventListener('input', (e) => {
    simLambda = parseInt(e.target.value);
    const label = document.getElementById('lambda-val-label');
    if (label) label.textContent = `${simLambda} ms`;
  });
}

// -------------------------------------------------------------
// 10. UI CONTROLLER: ACCORDION
// -------------------------------------------------------------
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    if (item) item.classList.toggle('open');
  });
});

// -------------------------------------------------------------
// IDEMPOTENT INITIALIZATION
// -------------------------------------------------------------
let panzerExplainerInitialized = false;

function initExplainer() {
  if (panzerExplainerInitialized) return;
  panzerExplainerInitialized = true;

  renderNodeTabs();
  renderNodeDetails();
  initWiresharkDissector();
  renderCryptoShell(3);
  renderPersona('GHOST');
  initCalculators();
  startSim();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExplainer);
} else {
  initExplainer();
}

