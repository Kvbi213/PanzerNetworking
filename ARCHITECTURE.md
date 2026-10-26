# ARCHITEKTURA SYSTEMU PANZERNETWORKING (PANZER-NET)

> **Status:** AKTYWNY (DIGITAL TWIN OPERATIONAL)  
> **Wersja:** 1.2.0-PROD  
> **Standard:** Antigravity Protocol (NANO v3.5)  
> **Stos Technologiczny:** React 19 + TypeScript + Vite 8 + Tailwind CSS + Framer Motion  
> **Ostatnia aktualizacja:** 2026-10-26  

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
├── core.ts                          <- Jądro koordynacji stanu symulatora, telemetrii i event-busa
├── core.tsx                         <- Główny punkt wejścia aplikacji React (Apple Design UI)
├── index.html                       <- Szkielet HTML5 mountujący drzewo React
├── package.json                     <- Definicja zależności i skryptów budowania
├── postcss.config.js                <- Konfiguracja procesora CSS Tailwind
├── tailwind.config.js               <- Tokeny kolorystyczne Apple Dark, rozmycia i typografia
├── tsconfig.json                    <- Ścisła konfiguracja kompilatora TypeScript
├── vite.config.ts                   <- Konfiguracja bundlera Vite z aliasami ścieżek
├── assets/
│   ├── images/                      <- Zasoby graficzne i schematy
│   ├── libs/                        <- Zewnętrzne biblioteki statyczne
│   └── styles/
│       └── index.css                <- Dyrektywy Tailwind, profile szkła akrylowego i speculary
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
    ├── components/
    │   ├── AttackMatrix.tsx         <- Tab 4: 4 scenariusze stresowe GPA-R z wyliczeniem bayesowskim
    │   ├── AuditDefense.tsx         <- Tab 5: Akordeon Q&A, bilans opóźnień (231 ms) i zestawienie BOM
    │   ├── FloatingNav.tsx          <- Pływająca wyspa szklana Apple-style z layoutId (spring tabs)
    │   ├── HeaderStatus.tsx         <- Pasek telemetrii (PPS, entropia H(X), PFS ratchet, selektor persony)
    │   ├── MatrioszkaCascade.tsx    <- Tab 3: Koncentryczny model SVG z dekonstrukcją algebry SPN+ARX
    │   ├── PhysicsSimulator.tsx     <- Tab 2: Silnik Canvas 2D 60 FPS z buforem Poissona i Chaff burst
    │   └── RouteInspector.tsx       <- Tab 1: Wireshark live inspector 1400 B i dekonstruktor L1–L7
    ├── crypto/
    │   └── cascade_crypto.ts        <- Obliczanie entropii Shannona, generator ramek 1400 B i hex-dump
    ├── kameleon/
    │   └── persona_engine.ts        <- Profile Ghost/Burner/Multi-Persona, poisoning szumu Canvas/WebGL
    ├── physics/
    │   └── poisson_engine.ts        <- Ciągły rozkład Poissona, weryfikacja memorylessness i kolejka RAM
    └── types/
        ├── nodes.ts                 <- Definicje i konfiguracja 6 węzłów tranzytowych
        ├── packet.ts                <- Typy binarne ramki MTU 1400 B i pól RFC
        └── simulation.ts            <- Typy parametrów, metryk i profili person
```

---

## 2. REJESTR PLIKÓW I ODPOWIEDZIALNOŚCI

| Plik / Moduł | Rola w systemie | Zależności | Status |
| --- | --- | --- | --- |
| `core.ts` | Singleton stanu, pętla telemetrii, obsługa mutacji parametrów | `modules/` | PRODUKCYJNY |
| `core.tsx` | Nadrzędny komponent React, orkiestracja zakładek z AnimatePresence | `core.ts`, `modules/components/` | PRODUKCYJNY |
| `assets/styles/index.css` | Tokeny wizualne Apple Design, specular highlights, optyczna typografia | Tailwind | PRODUKCYJNY |
| `modules/components/RouteInspector.tsx` | Dekonstrukcja ramki 1400 B, Wireshark hex-dump, widok adwersarza | `modules/crypto/cascade_crypto.ts` | PRODUKCYJNY |
| `modules/components/PhysicsSimulator.tsx` | Akcelerowany silnik cząsteczkowy Canvas 2D, suwaki tactile Apple | `modules/physics/poisson_engine.ts` | PRODUKCYJNY |
| `modules/components/MatrioszkaCascade.tsx` | Interaktywny model SVG 5 powłok z algebrą M-LWE, ARX i Rijndael | `modules/crypto/cascade_crypto.ts` | PRODUKCYJNY |
| `modules/components/AttackMatrix.tsx` | Symulacja 4 wektorów GPA-R, szansa powodzenia, audyt lab | React / Framer Motion | PRODUKCYJNY |
| `modules/components/AuditDefense.tsx` | Akordeon obrony inżynieryjnej, bilans RTT (~231 ms), warianty BOM | React / Framer Motion | PRODUKCYJNY |
| `modules/components/FloatingNav.tsx` | Pływający dok ze sprężynowym przełącznikiem `layoutId` | Framer Motion | PRODUKCYJNY |
| `modules/components/HeaderStatus.tsx` | Live wskaźniki statusu, przepływności, entropii i odliczania PFS | Lucide / Framer Motion | PRODUKCYJNY |

---

## 3. DŁUG TECHNICZNY I STATUS ZADAŃ

| ID | Kategoria | Opis | Priorytet | Status |
| --- | --- | --- | --- | --- |
| DT-001 | Implementacja | Opracowanie interaktywnej platformy Digital Twin w React + TS + Tailwind | WYSOKI | ZREALIZOWANO ✅ |
| DT-002 | Moduły | Implementacja dekonstruktora ramek i kalkulatora entropii Shannona | ŚREDNI | ZREALIZOWANO ✅ |
| DT-003 | Apple Design | Integracja fizyki sprężynowej, materiałów szklanych i bezpośredniej manipulacji | ŚREDNI | ZREALIZOWANO ✅ |
| DT-004 | Obsidian Sync | Pełna replikacja dokumentacji w `C:\Users\Jakub Lis\Documents\OBSIDIAN\PROJEKTY\PanzerNetworking\` | KRYTYCZNY | ZREALIZOWANO ✅ |
| DT-005 | Rust Core | Prototyp demona `panzer-core` w języku Rust dla Węzła 3 (Faza 2) | PLANOWANY | W KOLEJCE |
