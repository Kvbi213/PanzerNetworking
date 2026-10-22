# DOKUMENTACJA GŁÓWNA SYSTEMU PANZERNETWORKING (MASTER SPECIFICATION)
> ARCHITEKTURA ZERO-TRUST, KASKADA KRYPTOGRAFICZNA, IZOLACJA FIZYCZNA I PLATFORMA SYMULACYJNA
> Projekt: PanzerNetworking (PANZER-NET) | Standard: Antigravity Protocol (NANO v3.5) | Wersja: v1.2.0-PROD | Klasyfikacja: REFERENCE ARCHITECTURE / HARDENED

---

## SPIS TREŚCI
1. [Wprowadzenie, Cel Operacyjny i Filozofia Projektowa](#1-wprowadzenie-cel-operacyjny-i-filozofia-projektowa)
2. [Formalny Model Zagrożeń (Threat Model & Operational Economics)](#2-formalny-model-zagrożeń-threat-model--operational-economics)
3. [Topologia 6-Węzłowej Magistrali Tranzytowej (OSI L1–L7)](#3-topologia-6-węzłowej-magistrali-tranzytowej-osi-l1l7)
4. [Wielowarstwowa Kaskada Kryptograficzna (Model Matrioszki)](#4-wielowarstwowa-kaskada-kryptograficzna-model-matrioszki)
5. [Struktura Ramki Transportowej i Steganografia Sieciowa](#5-struktura-ramki-transportowej-i-steganografia-sieciowa)
6. [Warstwa Aplikacji: System Kameleon (Anti-Fingerprinting & Multi-Persona)](#6-warstwa-aplikacji-system-kameleon-anti-fingerprinting--multi-persona)
7. [Analiza Matematyczna, Statystyczna i Fizyczna](#7-analiza-matematyczna-statystyczna-i-fizyczna)
8. [Macierz Odporności Wektorowej (Widok Adwersarza)](#8-macierz-odporności-wektorowej-widok-adwersarza)
9. [Warianty Wdrożeniowe i Budżetowanie (BOM — Bill of Materials)](#9-warianty-wdrożeniowe-i-budżetowanie-bom--bill-of-materials)
10. [Specyfikacja Silnika Symulacyjnego (Digital Twin Web Platform)](#10-specyfikacja-silnika-symulacyjnego-digital-twin-web-platform)
11. [Metodologia Weryfikacji, Testy Penetracyjne i Audyt](#11-metodologia-weryfikacji-testy-penetracyjne-i-audyt)
12. [Mapa Drogowa Rozwoju (Roadmap v1.2 ➔ v3.0)](#12-mapa-drogowa-rozwoju-roadmap-v12--v30)

---

## 1. WPROWADZENIE, CEL OPERACYJNY I FILOZOFIA PROJEKTOWA

**PanzerNetworking** (`PANZER-NET`) to zaawansowana architektura referencyjna oraz interaktywne środowisko symulacyjne (Digital Twin) zaprojektowane w celu neutralizacji współczesnych wektorów inwigilacji sieciowej, głębokiej inspekcji pakietów (DPI), korelacji czasowej ruchu (Traffic Analysis) oraz śledzenia na poziomie przeglądarki i urządzenia (Device Fingerprinting).

### 1.1. Krytyczne podatności klasycznych rozwiązań prywatności
Standardowe narzędzia (pojedynczy VPN, czysty Tor, proxy SOCKS5) zawodzą w konfrontacji z zaawansowanym adwersarzem z czterech powodów:
1. **Lokalny ślad metadanych u ISP:** Domowy dostawca internetu (ISP) zawsze widzi fakt zestawienia połączenia ze znanym serwerem VPN lub węzłem wejściowym Tora (*Guard Node*), co pozwala na natychmiastowe wytypowanie użytkownika w danym obszarze geograficznym.
2. **Podatność na korelację czasową ($\Delta t$):** Pasywny obserwator monitorujący punkty wymiany ruchu (IXP) potrafi powiązać strumień wchodzący do sieci z wychodzącym, analizując objętość danych oraz odstępy czasowe pakietów.
3. **Sygnatury protokołów (DPI Detection):** Zapory sieciowe nowej generacji (NGFW) wykrywają charakterystyczne uściski dłoni (handshakes) protokołów OpenVPN, WireGuard czy obfs4, automatycznie blokując lub flagując połączenie.
4. **Wektor "Store Now, Decrypt Later" (SNDL):** Agencje wywiadowcze archiwizują zaszyfrowany ruch asymetryczny (oparty na RSA lub krzywych eliptycznych ECDH), czekając na osiągnięcie dojrzałości przez komputery kwantowe zdolne do uruchomienia algorytmu Shora.

### 1.2. Paradygmat PanzerNetworking
System rozwiązuje powyższe problemy poprzez **decentralizację zaufania (Zero-Trust)** i rozbicie transmisji na niezależne domeny fizyczne, chmurowe i kryptograficzne. Żaden pojedynczy węzeł w łańcuchu nie posiada jednocześnie wiedzy o adresie źródłowym (kim jesteś), adresie docelowym (dokąd zmierzasz) oraz treści pakietu (co przesyłasz).

---

## 2. FORMALNY MODEL ZAGROŻEŃ (THREAT MODEL & OPERATIONAL ECONOMICS)

W inżynierii bezpieczeństwa nie istnieje pojęcie „magicznej, 100% nienamierzalności”. PanzerNetworking definiuje bezpieczeństwo w kategoriach **ekonomii operacyjnej i asymetrii kosztów**.

### 2.1. Taksonomia celów bezpieczeństwa
Projekt operuje na trzech ściśle rozgraniczonych płaszczyznach:
* **Niewykrywalność (Undetectability / Steganography):** Ukrycie samego faktu istnienia kanału komunikacji (np. dla lokalnego ISP ruch nie istnieje; dla systemów DPI na dalszych węzłach wygląda jak standardowa telemetria HTTPS/WebSocket).
* **Anonimowość (Anonymity / Unlinkability):** Brak możliwości matematycznego i logicznego powiązania wyjściowego strumienia danych z fizyczną tożsamością operatora Węzła 0.
* **Praktyczna Nieopłacalność Deanonimizacji (Operational Infeasibility):** Stan, w którym zidentyfikowanie operatora wymaga zaangażowania zasobów finansowych, prawnych (wielojurysdykcyjne wnioski MLAT) oraz fizycznych (zespoły pelengacji radioelektrycznej SIGINT w terenie) wielokrotnie przewyższających wartość operacyjną celu.

### 2.2. Profil Przeciwnika (Adversary Capabilities)
Architektura została zaprojektowana przeciwko modelowi **GPA-R (Regional Global Passive Adversary + Active Probing)**:
* **Zdolności zakładane:** Pełny wgląd w logi krajowych dostawców internetu (ISP), możliwość pasywnego podsłuchu na głównych łączach światłowodowych (IXP), zdolność do aktywnego sondowania serwerów (Active DPI Probing), dostęp do wezwań prawnych wobec pojedynczych operatorów chmurowych, dysponowanie klastrem obliczeniowym do analizy kryptograficznej i korelacji ruchu.
* **Ograniczenia modelu (Poza zakresem ochrony sieciowej):** Architektura sieciowa nie chroni przed fizyczną kompromitacją stacji roboczej przed zaszyfrowaniem danych (np. implanty sprzętowe w BIOS/UEFI, kamery skierowane na ekran operatora) ani przed błędami behawioralnymi samego użytkownika (np. dobrowolne zalogowanie się na konto powiązane z prawdziwym nazwiskiem).

---

## 3. TOPOLOGIA 6-WĘZŁOWEJ MAGISTRALI TRANZYTOWEJ (OSI L1–L7)

```text
[ WĘZEŁ 0: STACJA ROBOCZA ] ── (System RAM-only: Tails / Whonix + Moduł Kameleon)
       │
       ▼ [1. Warstwa Fizyczna (OSI L1/L2): Wąska wiązka 60 GHz V-Band | 802.11ad/ay]
[ WĘZEŁ 1: MOST RADIOWY PtP ] ──> [ ZEWNĘTRZNY PUNKT DOSTĘPOWY "A" (Dach/DropBox) ]
       │
       ▼ [2. Warstwa Zmyłkowa (OSI L4/L7): TLS 1.3 + ECH / QUIC Datagram Stego]
[ WĘZEŁ 2: CHMURA ANYCAST CDN ] ── (Bezstanowy Edge Worker / Proxy 1)
       │
       ▼ [3. Warstwa Mieszająca (Mixnet Layer): Bufor Poissona + Dummy Chaff]
[ WĘZEŁ 3: WĘZEŁ P2P RELAY ] ── (Rozproszony węzeł domowy / Residential Mixnode)
       │
       ▼ [4. Warstwa Wejściowa (Ingress): Tunelowanie HTTP/2 WebSocket (RFC 8441)]
[ WĘZEŁ 4: WEBTUNNEL / PROXY 2 ] ── (Prywatny serwer VPS No-KYC za Reverse Proxy)
       │
       ▼ [5. Warstwa Cebulowa (Onion Routing): 3-Hop Circuit + Stream Isolation]
[ WĘZEŁ 5: SIEĆ TOR / MIXNET ] ── [ Guard ] ──> [ Middle ] ──> [ Exit ] ──> [ CEL ]
```

### Specyfikacja inżynieryjna poszczególnych węzłów:

#### WĘZEŁ 0: Stacja Robocza (Workstation Node)

* **Środowisko wykonawcze:** System operacyjny działający wyłącznie w pamięci ulotnej DRAM (Tails OS lub stacja robocza Whonix-Workstation odizolowana od bramy Whonix-Gateway).
* **Hardening sprzętowy:** Fizyczne wymontowanie wewnętrznych dysków twardych (NVMe/SATA), modułów Wi-Fi 2.4/5 GHz, Bluetooth oraz mikrofonu/kamery. Komunikacja ze światem odbywa się wyłącznie przez zewnętrzną kartę Ethernet USB podpiętą do mostu 60 GHz.
* **Zarządzanie pamięcią:** Zablokowany zrzut pamięci (Core Dumps disabled), włączone wymazywanie pamięci RAM przy wyłączeniu zasilania (*Cold-Boot Attack Mitigation* poprzez nadpisanie stron pamięci pseudolosowym szumem w czasie $< 300\text{ ms}$).

#### WĘZEŁ 1: Wąskowiązkowy Most Radiowy 60 GHz PtP (Physical Bypass)

* **Technologia:** Pasmo milimetrowe V-Band ($57–66\text{ GHz}$), standard IEEE 802.11ad/ay, modulacja OFDM/SC.
* **Charakterystyka propagacji:** Antena kierunkowa (zysk $> 35\text{ dBi}$) generująca wiązkę typu *Pencil Beam* o szerokości kątowej $\theta < 1.5^\circ$.
* **Fizyka tłumienia tlenowego:** W paśmie $60\text{ GHz}$ występuje zjawisko rezonansowej absorpcji energii elektromagnetycznej przez cząsteczki tlenu ($O_2$) w atmosferze, co powoduje tłumienie rzędu $15–16\text{ dB/km}$ (ponad stukrotny spadek mocy na każdy kilometr poza naturalnym tłumieniem w wolnej przestrzeni FSPL). Zapobiega to wyciekowi sygnału poza celowany odbiornik i radykalnie utrudnia wykrycie transmisji z boku (LPI/LPD — *Low Probability of Intercept / Low Probability of Detection*).
* **Szyfrowanie warstwy L2:** Dodatkowy tunel MACsec (IEEE 802.1AE) lub WPA3-Enterprise z kluczem statycznym między antenami.
* **Punkt A (DropBox):** Zewnętrzny punkt dostępowy (np. niezależne łącze światłowodowe w innej lokalizacji lub przemysłowy modem 5G z kartą pre-paid/eSIM kupioną anonimowo), zasilany opcjonalnie z układu fotowoltaicznego + akumulatora LiFePO4.

#### WĘZEŁ 2: Chmura Anycast CDN (Camouflage Proxy 1)

* **Infrastruktura:** Bezstanowe funkcje brzegowe (*Serverless Edge Functions*, np. Cloudflare Workers / Fastly Compute) działające na adresacji Anycast IP.
* **Maskowanie TLS:** Wykorzystanie rozszerzenia **ECH (Encrypted Client Hello)**, które szyfruje nagłówek SNI (*Server Name Indication*). Dostawca internetu w Punkcie A widzi wyłącznie połączenie z głównym adresem IP chmury Cloudflare, z którego korzystają miliony legalnych stron w tym samym czasie, ale nie widzi nazwy wywoływanej subdomeny Workera.
* **Działanie węzła:** Skrypt w chmurze nie posiada kluczy do ładunku. Zdejmuje jedynie zewnętrzny nagłówek transportowy i przekazuje strumień binarny do Węzła 3.

#### WĘZEŁ 3: Węzeł Mieszający P2P (Residential Mixnode)

* **Infrastruktura:** Lekki demon napisany w języku Rust/Go, uruchomiony na domowym łączu światłowodowym zaufanego węzła P2P (np. terminal Raspberry Pi / mikroserwer domowy).
* **Funkcja antykorelacyjna:** Węzeł implementuje algorytm **Stop-and-Go Mix**. Każdy przychodzący pakiet jest zatrzymywany w buforze pamięci RAM na losowy czas $\Delta t$ generowany z rozkładu wykładniczego (proces Poissona).
* **Normalizacja rozmiaru (Packet Padding) i Chaff:** Wszystkie pakiety wychodzące są wyrównywane do stałego rozmiaru **MTU 1400 bajtów**. Gdy stacja robocza nie wysyła danych, Węzeł 3 automatycznie generuje pakiety pozorne (*Dummy Chaff*), utrzymując stały przepływ bitów (Constant Bitrate Traffic Shaping) w kierunku Węzła 4.

#### WĘZEŁ 4: Prywatny Serwer VPS + Mostek WebTunnel (Ingress Proxy 2)

* **Infrastruktura:** Niezależny serwer VPS w jurysdykcji chroniącej prywatność (np. Islandia, Szwajcaria), opłacony z góry kryptowalutą **Monero (XMR)** poprzez łańcuch wymiany bez KYC.
* **Architektura maskująca:** Na serwerze działa prawdziwy serwer WWW (Caddy / Nginx) hostujący pozorną, publiczną stronę internetową (np. blog technologiczny lub repozytorium plików) z ważnym certyfikatem TLS Let's Encrypt.
* **Mechanizm WebTunnel:** Po podaniu tajnej ścieżki URL i odpowiedniego nagłówka autoryzacyjnego w zapytaniu HTTP/2, serwer dokonuje cichego podniesienia połączenia (*Connection Upgrade*) do strumienia WebSocket i przekazuje pakiety bezpośrednio do lokalnego gniazda demona Tor. Wszelkie sondy cenzorskie (Active Probing) wchodzące na ten adres IP otrzymują zwykłą stronę HTML.

#### WĘZEŁ 5: Sieć Cebulowa Tor (3-Hop Onion Circuit)

* **Struktura:** Standardowy trójstopniowy obwód (`Guard` ➔ `Middle` ➔ `Exit`), gdzie wejściem jest mostek z Węzła 4.
* **Izolacja strumieni (Stream Isolation):** Ruch z różnych aplikacji i kart przeglądarki na Węźle 0 jest oznaczany różnymi danymi autoryzacji SOCKS5 (`IsolateSOCKSAuth`), co wymusza na kliencie Tor budowanie całkowicie niezależnego obwodu (inny Middle i inny Exit Node) dla każdej otwartej domeny.

---

## 4. WIELOWARSTWOWA KASKADA KRYPTOGRAFICZNA (MODEL MATRIOSZKI)

Każdy pakiet opuszczający pamięć operacyjną Węzła 0 jest zamykany w kaskadzie niezależnych prymitywów kryptograficznych. Zastosowano zasadę **hybrydyzacji postkwantowej** oraz **łączenia szyfrów o odmiennej strukturze algebraicznej** (SPN + ARX):

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ POWŁOKA 1: KOPERTA TRANSPORTOWA & STEGANOGRAFIA (DPI STEGO ENVELOPE)         │
│ Nagłówek TLS 1.3 (Application Data 0x17) + ECH + Padding do 1400 B           │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ POWŁOKA 2: INKAPSULACJA POSTKWANTOWA (HYBRID KEM: X25519 + ML-KEM-1024)  │ │
│ │ Uzgadnianie kluczy sesyjnych odporne na klasyczne i kwantowe ataki       │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ POWŁOKA 3: SZYFR STRUMIENIOWY XCHACHA20-POLY1305 (256-BIT, ARX)      │ │ │
│ │ │ 192-bitowy rozszerzony Nonce, odporność na ataki czasowe (Cache)     │ │ │
│ │ │ ┌──────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ POWŁOKA 4: SZYFR BLOKOWY AES-256-GCM (256-BIT, SPN)              │ │ │ │
│ │ │ │ 14 rund Rijndaela, uwierzytelnianie w ciele Galois GF(2^128)     │ │ │ │
│ │ │ │ ┌──────────────────────────────────────────────────────────────┐ │ │ │ │
│ │ │ │ │ POWŁOKA 5: POTRÓJNY SZYFR CEBULOWY TOR + ŁADUNEK (PAYLOAD)   │ │ │ │ │
│ │ │ │ │ Komórki Tor (514 B) + Docelowy strumień end-to-end HTTPS     │ │ │ │ │
│ │ │ │ └──────────────────────────────────────────────────────────────┘ │ │ │ │
│ │ │ └──────────────────────────────────────────────────────────────────┘ │ │ │
│ │ └──────────────────────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.1. Uzasadnienie doboru algorytmów (Defense-in-Depth)

1. **Dlaczego `X25519 + ML-KEM-1024` (Hybryda)?** `ML-KEM-1024` (NIST FIPS 203, dawniej Kyber) opiera się na trudności problemu kratowego *Module Learning With Errors* (M-LWE), który jest odporny na algorytm Shora na komputerach kwantowych. Połączenie go z klasyczną krzywą eliptyczną `X25519` gwarantuje, że nawet jeśli w przyszłości zostanie odkryta luka w nowej matematyce kratowej, bezpieczeństwo połączenia nie spadnie poniżej poziomu klasycznego ECDH.
2. **Dlaczego kaskada `AES-256-GCM` + `XChaCha20-Poly1305`?**
* **AES-256** to szyfr blokowy oparty na sieci podstawieniowo-permutacyjnej (SPN) i ciele skończonym $\text{GF}(2^8)$.
* **XChaCha20** to szyfr strumieniowy oparty wyłącznie na operacjach **ARX** (*Addition, Rotation, XOR* na słowach 32-bitowych), niewykorzystujący żadnych tablic przeglądowych (S-Boxów).
* Złamanie kaskady wymagałoby jednoczesnego przełamania dwóch zupełnie różnych działów algebry w jednym podejściu kryptoanalitycznym.

### 4.2. Derywacja kluczy i Perfect Forward Secrecy (PFS)

Wspólny sekret uzgodniony podczas hybrydowego uścisku dłoni jest łączony w funkcji skrótu **HKDF-SHA512** (lub KMAC256):

$$K_{\text{master}} = \text{HKDF-Extract}\left(\text{Salt}, \; \text{SS}_{\text{X25519}} \parallel \text{SS}_{\text{ML-KEM-1024}}\right)$$

Z klucza głównego $K_{\text{master}}$ derywowane są niezależne podklucze dla warstwy AES ($K_{\text{AES}}$) oraz warstwy ChaCha20 ($K_{\text{ChaCha}}$). Co **60 sekund** (lub co $10^6$ przesłanych pakietów) następuje automatyczne przekluczowanie sesji (*Ratcheting*), a stare klucze są bezpowrotnie zerowane w pamięci RAM.

---

## 5. STRUKTURA RAMKI TRANSPORTOWEJ I STEGANOGRAFIA SIECIOWA

Aby wyeliminować wykrycie kaskady przez systemy DPI na podstawie nietypowych rozmiarów pakietów lub nagłówków, silnik PanzerNetworking (kompilowany w języku Rust/Go) formatuje każdy pakiet w ściśle określoną, znormalizowaną strukturę binarną o stałej długości **1400 bajtów**:

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Content Type  |         TLS Version           |    Length     |  <-- Nagłówek TLS 1.3
|    (0x17)     |           (0x0303)            |   (1395 B)    |      (5 bajtów - Jawny)
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                  XChaCha20 Extended Nonce                     |  <-- Losowy wektor IV
|                         (24 bajty)                            |      (192 bity)
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Packet Type  |         Payload Length        |   Reserved    |  <-- Zaszyfrowany nagłówek
| (0x01 / 0xFF) |           (2 bajty)           |   (1 bajt)    |      wewnętrzny (4 bajty)
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
~                   ZASZYFROWANY ŁADUNEK AES-GCM                ~  <-- Komórki Tor + Dane
|                   (Od 0 do 1322 bajtów danych)                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
~             LOSOWY PADDING WYRÓWNUJĄCY (0x00..0xFF)           ~  <-- Dopełnienie do 1400 B
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                   AES-256-GCM Auth Tag (16 B)                 |  <-- Tag integralności W4
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Poly1305 Auth Tag (16 B)                   |  <-- Tag integralności W3
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

* **Pole `Packet Type` (wewnątrz szyfru):** Wartość `0x01` oznacza prawdziwy pakiet danych (przekazywany dalej do sieci Tor). Wartość `0xFF` oznacza pakiet pozorny (*Dummy Chaff*) – węzeł odbierający weryfikuje jego tag Poly1305, po czym bezgłośnie niszczy pakiet w pamięci RAM. Obserwator zewnętrzny nie jest w stanie odróżnić pakietu `0x01` od `0xFF`, ponieważ oba mają dokładnie 1400 bajtów i entropię $H(X) \approx 8.0\text{ bitów/bajt}$.

---

## 6. WARSTWA APLIKACJI: SYSTEM KAMELEON (ANTI-FINGERPRINTING & MULTI-PERSONA)

Nawet najdoskonalszy tunel sieciowy zawiedzie, jeśli docelowy serwer lub system antybotowy (np. Cloudflare Turnstile, Akamai Bot Manager) zidentyfikuje użytkownika po unikalnych parametrach przeglądarki lub zachowaniu. Moduł **Kameleon** działa na Węźle 0 i zapewnia **opcjonalną niewykrywalność na styku z celem**.

### 6.1. Trzy Tryby Operacyjne (Operational Profiles)

| Tryb | Przeznaczenie | Konfiguracja Przeglądarki i Sieci | Widok Serwera Docelowego |
| --- | --- | --- | --- |
| **1. GHOST / STEALTH** *(Niewykrywalność antybotowa)* | Wchodzenie na strony silnie chronione przed ruchem Tor/VPN, panele logowania, standardowe serwisy. | Wyjście z Węzła 4 (czysty Residential/VPS IP) lub selekcjonowany Exit Node + Spoofing profilu pod popularny system (np. Windows 11 + Chrome 128). | Zwykły, niepodejrzany użytkownik domowy. Brak wyzwań CAPTCHA i blokad. |
| **2. BURNER / ISOLATE** *(Maksymalna anonimowość)* | Jednorazowy dostęp do wrażliwych zasobów, research zagrożeń (OSINT/Darknet). | Pełna trasa 6 węzłów (z Torem), poziom bezpieczeństwa *Safest* (całkowita blokada JS, WebGL, WebAudio, czcionek zdalnych). | Zunifikowany profil Tor Browser. Po zamknięciu karty kontener RAM ulega zniszczeniu. |
| **3. MULTI-PERSONA** *(Separacja tożsamości)* | Prowadzenie wielu niezależnych operacji jednocześnie bez ryzyka korelacji krzyżowej (Cross-Site Tracking). | Każda karta działa w osobnym kontenerze z unikalnym zziarnieniem (Canvas/Audio seed) i osobnym obwodem wyjściowym Tora. | Trzy otwarte karty wyglądają dla analityki internetowej jak 3 różne komputery w 3 różnych krajach. |

### 6.2. Wektory maskowania sprzętowego i behawioralnego w module Kameleon

1. **Canvas & WebGL Poisoning:** Wstrzykiwanie deterministycznego (stałego w obrębie jednej sesji/persony, ale losowego między sesjami) szumu do pikseli renderowanych przez HTML5 Canvas i buforów WebGL, co zmienia hash karty graficznej.
2. **WebRTC & DNS Leak Lockdown:** Całkowite wyłączenie protokołu UDP na poziomie jądra systemu operacyjnego (iptables/nftables drop dla wszystkiego poza lokalnym portem tunelu). Zapytania DNS są rozwiązywane wyłącznie po stronie węzła wyjściowego (Remote DNS over SOCKS5/DoH).
3. **Keystroke & Mouse Jitter Normalization:** Warstwa pośrednia przechwytująca zdarzenia `keydown`, `keyup` oraz `mousemove`. Wygładza ona biometryczny rytm pisania operatora (czas przytrzymania klawisza *Dwell Time* oraz czas przejścia między klawiszami *Flight Time*), uniemożliwiając identyfikację autora tekstu metodami uczenia maszynowego.

---

## 7. ANALIZA MATEMATYCZNA, STATYSTYCZNA I FIZYCZNA

### 7.1. Matematyka Mieszalnika P2P (Rozkład Poissona i Entropia Shannona)

W Węźle 3 pakiety są opóźniane zgodnie z rozkładem wykładniczym o gęstości prawdopodobieństwa:

$$f(t; \lambda) = \begin{cases} \lambda e^{-\lambda t} & \text{dla } t \ge 0 \\ 0 & \text{dla } t < 0 \end{cases}$$

Gdzie parametr $\lambda$ określa średnią intensywność uwalniania pakietów. Własność **braku pamięci (Memorylessness)** rozkładu wykładniczego:

$$P(T > s + t \mid T > s) = P(T > t)$$

oznacza, że obserwator zewnętrzny, widząc czas nadejścia pakietu do Węzła 3, nie uzyskuje żadnej przewagi statystycznej w zgadywaniu, który z pakietów opuszczających węzeł po czasie $t$ odpowiada pakietowi wejściowemu (przy obecności ruchu pozornego *Chaff*).

**Entropia Shannona dla strumienia zaszyfrowanego:**
Dla losowej zmiennej bajtowej $X \in \{0, 1, \dots, 255\}$ entropia pakietu wynosi:

$$H(X) = -\sum_{i=0}^{255} P(x_i) \log_2 P(x_i)$$

Dla poprawnej implementacji kaskady `AES-256-GCM + XChaCha20`, rozkład bajtów jest jednostajny ($P(x_i) \approx \frac{1}{256}$), co daje wartość $H(X) \in [7.9990, \; 7.9999]\text{ bitów/bajt}$, potwierdzając brak jakichkolwiek wzorców statystycznych w ładunku.

### 7.2. Fizyka Łącza Radiowego 60 GHz (Bilans Łącza i Tłumienie)

Całkowite tłumienie ścieżki radiowej $L_{\text{total}}$ na odcinku $d$ (w kilometrach) w paśmie $f = 60\text{ GHz}$ opisuje równanie:

$$L_{\text{total}}\text{ [dB]} = \underbrace{92.45 + 20\log_{10}(f_{\text{GHz}}) + 20\log_{10}(d_{\text{km}})}_{\text{Tłumienie w wolnej przestrzeni (FSPL)}} + \underbrace{\gamma_{O_2} \cdot d_{\text{km}}}_{\text{Absorpcja tlenowa}} + \underbrace{\gamma_{\text{rain}} \cdot d_{\text{km}}}_{\text{Tłumienie deszczu}}$$

Gdzie współczynnik absorpcji tlenowej $\gamma_{O_2} \approx 16\text{ dB/km}$.

* Na dystansie operacyjnym $d = 0.2\text{ km}$ ($200\text{ metrów}$) link działa z pełną prędkością $1\text{ Gbps}$ i opóźnieniem $< 1\text{ ms}$.
* Jednak już w odległości $3\text{ km}$ za odbiornikiem (lub pod kątem $> 2^\circ$ od osi głównej anteny) dodatkowe tłumienie tlenowe i charakterystyka kierunkowa redukują moc sygnału poniżej poziomu szumu termicznego tła ($N_0 = k_B T B \approx -174\text{ dBm/Hz}$), czyniąc zdalną detekcję wiązki z dużej odległości fizycznie skrajnie trudną.

### 7.3. Granica Termodynamiczna i Margines Bezpieczeństwa NIST

> **Nota Metodologiczna:** Poniższe wyliczenie oparte na zasadzie Landauera stanowi **teoretyczną dolną granicę fizyczną (Theoretical Lower Bound)** kosztu energetycznego nieodwracalnych operacji logicznych, a nie bezpośredni model zużycia prądu przez współczesne układy ASIC.

1. **Margines praktyczny (Standardy NIST):** Dla klucza 256-bitowego przestrzeń przeszukiwania wynosi $2^{256} \approx 1.1579 \times 10^{77}$ operacji. Przy zastosowaniu algorytmu kwantowego Grovera złożoność spada do $\sqrt{2^{256}} = 2^{128} \approx 3.40 \times 10^{38}$ operacji kwantowych – wartość ta pozostaje całkowicie poza zasięgiem obliczeniowym na kolejne stulecia.
2. **Granica termodynamiczna Landauera:** Minimalna energia wymagana do skasowania 1 bitu informacji w temperaturze $T$ wynosi $E_{\text{min}} = k_B T \ln 2$. Nawet przy idealnym procesorze operującym w temperaturze promieniowania tła kosmicznego ($T = 3\text{ K}$), wykonanie $2^{256}$ nieodwracalnych przejść stanowych wymagałoby energii rzędu $\approx 3.32 \times 10^{56}\text{ J}$ (co przekracza całkowitą energię wyemitowaną przez miliony gwiazd wielkości Słońca w ciągu całego ich życia). Dowodzi to, że atak *Brute-Force* na 256-bitową kaskadę symetryczną jest wykluczony przez fundamentalne prawa fizyki.

---

## 8. MACIERZ ODPORNOŚCI WEKTOROWEJ (WIDOK ADWERSARZA)

Tabela definiuje dokładny zakres informacji dostępnych dla poszczególnych podmiotów w łańcuchu transmisji przy założeniu poprawnej konfiguracji OPSEC:

| # | Obserwator / Adwersarz | Co rejestruje w logach? | Czego NIE JEST w stanie ustalić? | Wektor mitygacji w PanzerNet |
| --- | --- | --- | --- | --- |
| **1** | **Domowy ISP Operatora** | Całkowity brak ruchu (Stan linii: IDLE / 0 B) | Faktu obecności operatora przy komputerze i jakiejkolwiek transmisji | Fizyczny bypass przez most radiowy 60 GHz (Węzeł 1) |
| **2** | **Skaner radiowy (Wardriving)** | Szum tła w paśmie 2.4 / 5 GHz | Istnienia linku 60 GHz (o ile nie znajdzie się dokładnie na osi wiązki $1.5^\circ$) | Skupiona wiązka *Pencil Beam* + tłumienie tlenowe $O_2$ |
| **3** | **ISP Punktu Zewnętrznego A** | Strumień TLS 1.3 (1400 B) do IP Anycast Cloudflare | Lokalizacji Węzła 0, nazwy subdomeny (dzięki ECH), treści oraz dalszej trasy | Encrypted Client Hello + maskowanie w chmurze CDN |
| **4** | **System DPI / Cenzor Państwowy** | Poprawne pakiety HTTPS / HTTP/2 WebSocket | Sygnatur protokołów VPN/Tor (brak uścisków dłoni WireGuard/obfs4) | Koperta steganograficzna + WebTunnel za serwerem Nginx |
| **5** | **Operator Chmury (Węzeł 2)** | Przekierowanie strumienia z IP Punktu A do IP Węzła 3 | Fizycznej lokalizacji nadawcy, treści pakietów (szyfr 256-bit) oraz celu za Torem | Brak kluczy deszyfrujących na brzegu chmury (Blind Relay) |
| **6** | **Globalny Obserwator (IXP)** | Zaszyfrowany strumień stałej przepływności (CBR) | Korelacji czasu wejścia i wyjścia pakietu ($\Delta t$) oraz faktycznej objętości danych | Bufor Poissona + pakiety pozorne *Dummy Chaff* w Węźle 3 |
| **7** | **Tor Guard Node (Węzeł 5a)** | Połączenie przychodzące z serwera VPS (Węzeł 4) | Adresu IP Węzła 3, Punktu A, Węzła 0 oraz adresu serwera docelowego | Wielowarstwowe odcięcie tranzytowe przed wejściem do Tora |
| **8** | **Serwis Docelowy & Anti-Bot** | Zapytanie z IP Exit Node / Proxy z profilem zwykłego PC | Prawdziwego systemu (Tails), lokalizacji fizycznej oraz powiązań z innymi sesjami | Moduł Kameleon (Spoofing Fingerprintingu + Izolacja) |

---

## 9. WARIANTY WDROŻENIOWE I BUDŻETOWANIE (BOM — BILL OF MATERIALS)

Architektura PanzerNetworking jest skalowalna i może zostać wdrożona w trzech wariantach budżetowych w zależności od wymaganego poziomu odporności:

### Wariant A: "Zero-Budget / Research Lab" (Koszt: 0 PLN)

*Przeznaczony do testów programowych, nauki architektury i symulacji na jednym łączu.*

* **Węzeł 0:** Istniejący komputer uruchomiony z pendrive'a z systemem Tails OS.
* **Węzeł 1:** Pominięty (lub połączenie z otwartym punktem Wi-Fi za pomocą zewnętrznej karty USB z rotacją MAC).
* **Węzeł 2:** Darmowe konto Cloudflare Workers (plan Free: 100 000 zapytań/dzień).
* **Węzeł 3:** Komputer znajomego wpięty w darmową sieć P2P (np. Tailscale Exit Node / własny skrypt Go).
* **Węzeł 4 i 5:** Darmowe, publiczne mostki Tor **WebTunnel** lub **Snowflake** pobierane z `@GetBridgesBot`.

### Wariant B: "Sweet Spot / Prosumer Hardened" (CAPEX: ~1 800 PLN | OPEX: ~35 PLN/mies.)

*Rekomendowany wariant zapewniający pełną izolację fizyczną i wysoką przepustowość (30–80 Mbps).*

* **Węzeł 0 (Stacja):** Poleasingowy laptop biznesowy **Lenovo ThinkPad T480** (Intel Core i5-8250U ze sprzętowym wsparciem AES-NI, wymontowane moduły Wi-Fi/BT/dyski) — **~850 PLN**.
* **Węzeł 1 (Radio 60 GHz):** Zestaw sparowanych anten **MikroTik Wireless Wire (wAP 60G)** z pełnym dupleksem 1 Gbps — **~900 PLN**.
* **Węzeł 2 i 4 (Chmura & VPS):** Prywatny serwer VPS (np. w Islandii/Szwajcarii, 2 vCPU, 2 GB RAM, łącze 1 Gbps) opłacony z góry kryptowalutą **Monero (XMR)** + darmowa warstwa Cloudflare z przodu — **~35 PLN / miesiąc**.

### Wariant C: "High-Assurance / Field Grade" (CAPEX: ~6 500+ PLN | OPEX: ~150 PLN/mies.)

*Pełna autonomia energetyczna i sprzętowa.*

* **Węzeł 0:** Laptop z wyczyszczonym i zmodyfikowanym wsadem BIOS (**Coreboot + wyłączony Intel ME**) oraz sprzętowym przełącznikiem zasilania pamięci RAM.
* **Węzeł 1:** Dalekosiężny most 60 GHz **MikroTik Cube 60Pro ac** (802.11ay, zasięg do $1–2\text{ km}$) + autonomiczny Węzeł DropBox zasilany z panelu solarnego 100W i akumulatora LiFePO4 z przemysłowym routerem 5G eSIM.
* **Węzły 2–4:** Kaskada dwóch niezależnych serwerów VPS w różnych jurysdykcjach (np. Islandia ➔ Panama) z pełnym generowaniem ruchu pozornego 24/7 (*Constant Cover Traffic*).

---

## 10. SPECYFIKACJA SILNIKA SYMULACYJNEGO (DIGITAL TWIN WEB PLATFORM)

Repozytorium zawiera w pełni funkcjonalną, interaktywną aplikację webową (`index.html`), stanowiącą cyfrowego bliźniaka (Digital Twin) architektury PanzerNetworking. Aplikacja działa w 100% po stronie klienta (Client-Side JS/Canvas/SVG) bez zewnętrznych zależności serwerowych.

### Architektura 5 Modułów Aplikacji:

1. **Moduł 1: Interaktywna Trasa Pakietu & Wireshark Live Inspector (`#tab-route`)**
* Wizualizacja krokowa przejścia pakietu przez węzły $0 \to 5$.
* Dynamiczny dekonstruktor ramek OSI (L1–L7) wyświetlający zrzut heksadecymalny (HEX/ASCII) dla każdego przeskoku, na żywo obliczający entropię Shannona oraz pokazujący, które pola nagłówków są zaszyfrowane.

2. **Moduł 2: Symulator Fizyki Ruchu 60 FPS (`#tab-sim`)**
* Silnik cząsteczkowy HTML5 Canvas 2D z obsługą ekranów Retina/High-DPI (`devicePixelRatio`).
* Parametry sterowane w czasie rzeczywistym: częstotliwość nadawania (PPS), parametr $\lambda$ rozkładu Poissona (Jitter ms), generowanie wybuchów szumu (*Chaff Burst*) oraz symulacja aktywnego ataku sondy DPI na Węzeł 2 i Węzeł 4.

3. **Moduł 3: Dekonstruktor Kaskady Matrioszki (`#tab-matrioszka`)**
* Interaktywny model koncentryczny SVG prezentujący 5 powłok kryptograficznych wraz z macierzami stanu algorytmów Rijndael (AES), ćwierć-rundą ARX (ChaCha20) oraz wielomianami kratowymi (ML-KEM).

4. **Moduł 4: Macierz Symulacji Wektorów Ataku (`#tab-matrix`)**
* Interaktywne scenariusze testowe (m.in. *Atak Korelacji Czasowej GPA*, *Kompromitacja Węzła Exit*, *Atak Kwantowy Shora*, *Zimny Start RAM / Cold-Boot*) z wyliczeniem prawdopodobieństwa sukcesu adwersarza.

5. **Moduł 5: Panel Audytowy i Obrona Architektury (`#tab-defense`)**
* Baza wiedzy w formie Q&A odpowiadająca na rygorystyczne pytania audytorów bezpieczeństwa, omawiająca kompromisy inżynieryjne (trade-offs), opóźnienia (latency budget) oraz procedury OPSEC.

---

## 11. METODOLOGIA WERYFIKACJI, TESTY PENETRACYJNE I AUDYT

Aby przenieść architekturę z fazy symulacji do zweryfikowanego wdrożenia labowego, zdefiniowano 4 rygorystyczne protokoły testowe (kryteria akceptacyjne *Pass/Fail*):

1. **Test Szczelności Lokalnej (Zero-Leak Verification):**
* *Procedura:* Podłączenie sondy pasywnej (Network TAP) z uruchomionym pakietem `tcpdump` pomiędzy stacją roboczą a interfejsem sieciowym przez 24 godziny intensywnej pracy i celowego wymuszania błędów aplikacji.
* *Kryterium Pass:* `0` pakietów DNS, ARP, IPv6 Router Solicitation, STUN/WebRTC oraz `0` pakietów wychodzących poza zdefiniowany tunel 60 GHz.

2. **Test Entropii i Nierozróżnialności DPI (Statistical Indistinguishability):**
* *Procedura:* Przechwycenie $100\,000$ pakietów na wyjściu z Węzła 1 (Punkt A) i poddanie ich analizie za pomocą zestawu testów statystycznych **NIST SP 800-22** oraz narzędzia `ent`.
* *Kryterium Pass:* Entropia ładunku $H(X) > 7.999\text{ b/B}$, test Chi-kwadrat w normie losowości, brak wykrycia tunelu przez reguły systemów Suricata, Zeek oraz nDPI.

3. **Test Odporności na Korelację Czasową (KS-Test):**
* *Procedura:* Rejestracja znaczników czasu ($t_{\text{in}}$) pakietów wchodzących do Węzła 3 i wychodzących ($t_{\text{out}}$) przy włączonym buforze Poissona i ruchu *Chaff*. Przeprowadzenie testu Kołmogorowa-Smirnowa pod kątem korelacji krzyżowej.
* *Kryterium Pass:* Współczynnik korelacji Pearsona $r < 0.05$ dla okna obserwacyjnego poniżej 60 minut.

4. **Test Odporności na Aktywne Sondowanie (Active Probing Resistance):**
* *Procedura:* Przeskanowanie Węzła 4 (WebTunnel VPS) za pomocą narzędzi `Nmap` (pełny skan portów i usług) oraz wysłanie nieautoryzowanych i zniekształconych zapytań HTTP/1.1, HTTP/2 i TLS.
* *Kryterium Pass:* Serwer zwraca wyłącznie standardowe odpowiedzi `200 OK` (strona-przykrywka) lub `404 Not Found` o identycznych nagłówkach jak czysty serwer Nginx/Caddy, nie zdradzając obecności gniazda WebSocket ani demona Tor.

---

## 12. MAPA DROGOWA ROZWOJU (ROADMAP v1.2 ➔ v3.0)

Projekt PanzerNetworking jest rozwijany iteracyjnie zgodnie ze standardem *Semantic Versioning*:

* **[ZREALIZOWANO] Faza 1 (v1.0 – v1.2): Specyfikacja Architektoniczna i Digital Twin**
* Opracowanie topologii 6 węzłów i modelu kaskady kryptograficznej.
* Stworzenie interaktywnego symulatora webowego 60 FPS (`index.html`) z inspektorem pakietów.
* Formalizacja modelu zagrożeń (Threat Model) i audyt teoretyczny.

* **[W TRAKCIE] Faza 2 (v2.0): Prototyp Rdzenia w Rust / Go (`panzer-core`)**
* Implementacja demona CLI w języku Rust z wykorzystaniem bibliotek `ring`, `pqcrypto-kyber` oraz `tokio`.
* Wdrożenie natywnego bufora Poissona i generatora pakietów pozornych *Dummy Chaff* dla Węzła 3.
* Skrypty automatycznej konfiguracji (Ansible / Terraform) dla bezobsługowego stawiania Węzła 2 (Cloudflare Worker) i Węzła 4 (VPS + Caddy + WebTunnel).

* **[PLANOWANE] Faza 3 (v3.0): Integracja z Sieciami Mixnet Nowej Generacji i Sprzętem**
* Opcjonalne zastąpienie warstwy Tor (Węzeł 5) zdecentralizowanym mixnetem **Nym** (wykorzystującym format pakietów *Sphinx*).
* Gotowy obraz systemu Live ISO (oparty na Debianie/Tails) z prekonfigurowanym modułem **Kameleon** i automatycznym zestawianiem tunelu po wykryciu interfejsu 60 GHz.

---

*Dokument wygenerowany jako główna specyfikacja techniczna repozytorium **PanzerNetworking**. Przeznaczony do celów badawczych, edukacyjnych oraz projektowania systemów bezpieczeństwa klasy Zero-Trust.*
