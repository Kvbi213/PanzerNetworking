# ARCHITEKTURA SYSTEMU PANZERNETWORKING (PANZER-NET)

> **Status:** W TRAKCIE ROZWOJU (PHASE 1 -> PHASE 2)  
> **Wersja:** 1.2.0-PROD  
> **Standard:** Antigravity Protocol (NANO v3.5)  
> **Ostatnia aktualizacja:** 2026-10-22  

---

## 1. DRZEWO STRUKTURY PROJEKTU

```text
c:\Users\Jakub Lis\Desktop\01_PROJEKTY\SafeNet/
├── .env.example                     <- Wzorzec zmiennych środowiskowych węzłów
├── .gitignore                       <- Reguły wykluczeń poufnych i binariów
├── ARCHITECTURE.md                  <- Rejestr architektury, zależności i długu technicznego
├── HISTORY.md                       <- Rejestr rewizji (append-only)
├── README.md                        <- Zarys publiczny projektu
├── ZASADYPRACY.md                   <- Protokół operacyjny i rygor inżynieryjny [KRYTYCZNY]
├── core.js                          <- Jądro logiki routingu, kaskady i symulacji
├── index.html                       <- Cyfrowy Bliźniak (Digital Twin 60 FPS Web Platform)
├── assets/
│   ├── images/                      <- Zasoby graficzne i schematy
│   ├── libs/                        <- Zewnętrzne biblioteki statyczne (offline-first)
│   └── styles/                      <- Arkusze stylów dark-tech
├── data/
│   ├── finanse/                     <- Zestawienia kosztorysowe BOM
│   ├── logs/                        <- Logi symulacji i telemetria
│   ├── reports/                     <- Raporty audytowe i testy szczelności
│   └── scans/                       <- Zrzuty pcap i wyniki testów NIST SP 800-22
├── docs/
│   ├── architecture/
│   │   └── MASTER_DOCUMENT.md       <- Nadrzędna specyfikacja inżynieryjna
│   ├── errors/                      <- Rejestr defektów (ERROR_DIFF)
│   └── versions/
│       └── v1.2.0.md                <- Dokumentacja wydania v1.2.0-PROD
└── modules/
    ├── cascade_crypto.js            <- Silnik kaskady kryptograficznej (SPN + ARX)
    ├── kameleon_engine.js           <- Warstwa maskowania behawioralnego i sprzętowego
    ├── packet_inspector.js          <- Dekonstruktor ramek OSI L1-L7 i kalkulator entropii
    └── poisson_jitter.js            <- Symulator procesu Poissona i bufora Stop-and-Go
```

---

## 2. REJESTR PLIKÓW I ODPOWIEDZIALNOŚCI

| Plik / Moduł | Rola w systemie | Zależności | Status |
| --- | --- | --- | --- |
| `ZASADYPRACY.md` | Rygor operacyjny, ochrona przed regresją, zero-emoji | Brak | AKTYWNY |
| `ARCHITECTURE.md` | Topologia projektu, rejestr stanu, dług techniczny | Cały system | AKTYWNY |
| `HISTORY.md` | Historia rewizji i ewolucja kodu (SemVer) | `docs/versions/` | AKTYWNY |
| `docs/architecture/MASTER_DOCUMENT.md` | Nadrzędna specyfikacja inżynieryjna L1–L7 | Brak | ZWERYFIKOWANY |
| `docs/versions/v1.2.0.md` | Raport wydania v1.2.0-PROD z checklistą | `MASTER_DOCUMENT.md` | ZWERYFIKOWANY |
| `core.js` | Główny koordynator stanu symulatora i magistrali pakietów | Moduły w `/modules/` | PLANOWANY |
| `index.html` | Platforma Digital Twin (Canvas 2D, SVG Matrioszka, Inspektor) | `core.js`, `assets/styles/` | PLANOWANY |
| `/modules/cascade_crypto.js` | Emulacja warstw AES-256-GCM, XChaCha20, ML-KEM-1024 | `core.js` | PLANOWANY |
| `/modules/poisson_jitter.js` | Implementacja rozkładu wykładniczego i generowania Chaff | `core.js` | PLANOWANY |
| `/modules/packet_inspector.js` | Analiza bitowa 1400 B i kalkulacja entropii Shannona | `core.js` | PLANOWANY |
| `/modules/kameleon_engine.js` | Emulacja profilowania anti-fingerprinting i jittera myszy | `core.js` | PLANOWANY |

---

## 3. LOGIKA CORE I MODUŁÓW

- **Topologia 6 Węzłów:**
  - Węzeł 0 (Stacja Robocza RAM-only)
  - Węzeł 1 (Most Radiowy 60 GHz PtP)
  - Węzeł 2 (Anycast CDN Edge Worker z ECH)
  - Węzeł 3 (P2P Residential Mixnode z buforem Poissona i stałym MTU 1400 B)
  - Węzeł 4 (VPS WebTunnel za Nginx/Caddy)
  - Węzeł 5 (Sieć Cebulowa Tor: Guard -> Middle -> Exit -> Cel)
- **Model Kryptograficzny (Matrioszka):**
  - Hybryda postkwantowa KEM: X25519 + ML-KEM-1024.
  - Podwójna kaskada symetryczna: XChaCha20-Poly1305 (ARX) + AES-256-GCM (SPN).
  - Perfect Forward Secrecy i Ratcheting co 60 sekund.

---

## 4. DŁUG TECHNICZNY I ZADANIA BIEŻĄCE

| ID | Kategoria | Opis | Priorytet |
| --- | --- | --- | --- |
| DT-001 | Implementacja | Opracowanie interaktywnej platformy Digital Twin w `index.html` i `core.js` | WYSOKI |
| DT-002 | Moduły | Implementacja dekonstruktora ramek i kalkulatora entropii Shannona | ŚREDNI |
| DT-003 | Rust Core | Prototyp demona `panzer-core` w języku Rust dla Węzła 3 (faza 2) | PLANOWANY |
| DT-004 | Obsidian Sync | Pełna replikacja dokumentacji w `C:\Users\Jakub Lis\Documents\OBSIDIAN\PROJEKTY\PanzerNetworking\` | KRYTYCZNY |
