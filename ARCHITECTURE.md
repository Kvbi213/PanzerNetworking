# ARCHITEKTURA SYSTEMU PANZERNETWORKING (PANZER-NET)

> **Status:** AKTYWNY (DIGITAL TWIN OPERATIONAL & PRODUCTION-READY)  
> **Wersja:** 1.2.1-PROD  
> **Standard:** Antigravity Protocol (NANO v3.5)  
> **Stos Technologiczny:** React 19 + TypeScript + Vite 8 + Tailwind CSS + Framer Motion  
> **Ostatnia aktualizacja:** 2026-10-26  

---

## 1. DRZEWO STRUKTURY PROJEKTU

```text
c:\Users\Jakub Lis\Desktop\01_PROJEKTY\SafeNet/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                <- Automatyczny build (Vite), linter i deploy GitHub Pages
├── .env.example                     <- Wzorzec zmiennych środowiskowych węzłów
├── .gitignore                       <- Reguły wykluczeń poufnych i binariów
├── ARCHITECTURE.md                  <- Rejestr architektury, zależności i długu technicznego
├── HISTORY.md                       <- Rejestr rewizji (append-only)
├── LICENSE                          <- Licencja MIT z klauzulą badawczo-edukacyjną
├── README.md                        <- Wizytówka repozytorium GitHub (diagramy, odznaki, QuickStart)
├── ZASADYPRACY.md                   <- Protokół operacyjny i rygor inżynieryjny [KRYTYCZNY]
├── core.ts                          <- Jądro koordynacji stanu symulatora, telemetrii i event-busa
├── core.tsx                         <- Główny punkt wejścia aplikacji React (Apple Design UI)
├── index.html                       <- Szkielet HTML5 mountujący drzewo React
├── system_explainer.html            <- Samodzielny, interaktywny Master Explainer (Apple Design)
├── system_explainer.css             <- Modułowy arkusz stylów Master Explainer (Apple tokens & glass)
├── system_explainer.js              <- Kontroler UI z czystym API DOM (Zero innerHTML, strict CSP)
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
│   ├── finanse/
│   │   └── BOM_CALCULATION.md       <- Kosztorys wdrożeniowy (Warianty A, B, C)
│   ├── logs/                        <- Logi symulacji i telemetria
│   ├── reports/
│   │   ├── KS_TIMING_CORRELATION_TEST.md <- Wyniki testu Kołmogorowa-Smirnowa
│   │   └── ZERO_LEAK_AUDIT_REPORT.md     <- Raport 24h audytu Hardware TAP (Zero-Leak)
│   └── scans/
│       └── NIST_SP800_22_RESULTS.json    <- Wyniki testów losowości i entropii Shannona
├── docs/
│   ├── architecture/
│   │   └── MASTER_DOCUMENT.md       <- Nadrzędna specyfikacja inżynieryjna L1–L7
│   ├── errors/                      <- Rejestr defektów (ERROR_DIFF)
│   └── versions/
│       └── v1.2.0.md                <- Dokumentacja wydania v1.2.0-PROD
└── modules/
    ├── camouflage-worker/
    │   └── worker.js                <- Szablon Węzła 2: Cloudflare Edge Worker z ECH
    ├── components/
    │   ├── AttackMatrix.tsx         <- Tab 4: 4 scenariusze stresowe GPA-R z wyliczeniem bayesowskim
    │   ├── AuditDefense.tsx         <- Tab 5: Akordeon Q&A, bilans opóźnień (231 ms) i zestawienie BOM
    │   ├── FloatingNav.tsx          <- Pływająca wyspa szklana Apple-style z layoutId (spring tabs)
    │   ├── HeaderStatus.tsx         <- Pasek telemetrii (PPS, entropia H(X), PFS ratchet, selektor persony)
    │   ├── MatrioszkaCascade.tsx    <- Tab 3: Koncentryczny model SVG z dekonstrukcją algebry SPN+ARX
    │   ├── PhysicsSimulator.tsx     <- Tab 2: Silnik Canvas 2D 60 FPS z buforem Poissona i Chaff burst
    │   ├── RouteInspector.tsx       <- Tab 1: Wireshark live inspector 1400 B i dekonstruktor L1–L7
    │   └── SystemExplainer.tsx      <- Tab 6: Master Explainer & Kompendium (Apple Design)
    ├── crypto/
    │   └── cascade_crypto.ts        <- Obliczanie entropii Shannona, generator ramek 1400 B i hex-dump
    ├── kameleon/
    │   └── persona_engine.ts        <- Profile Ghost/Burner/Multi-Persona, poisoning szumu Canvas/WebGL
    ├── panzer-core/
    │   ├── Cargo.toml               <- Konfiguracja projektu Rust dla Węzła 3
    │   └── src/main.rs              <- Prototyp demona CLI w Rust (bufor Poissona, Dummy Chaff)
    ├── physics/
    │   └── poisson_engine.ts        <- Ciągły rozkład Poissona, weryfikacja memorylessness i kolejka RAM
    ├── types/
    │   ├── nodes.ts                 <- Definicje i konfiguracja 6 węzłów tranzytowych
    │   ├── packet.ts                <- Typy binarne ramki MTU 1400 B i pól RFC
    │   └── simulation.ts            <- Typy parametrów, metryk i profili person
    └── webtunnel-proxy/
        ├── Caddyfile                <- Szablon Caddy dla Węzła 4 (Cover site + WebSocket upgrade)
        └── nginx.conf               <- Szablon Nginx dla Węzła 4 z blokadą sond cenzorskich
```

---

## 2. REJESTR PLIKÓW I ODPOWIEDZIALNOŚCI

| Plik / Moduł | Rola w systemie | Zależności | Status |
| :--- | :--- | :--- | :--- |
| `core.ts` | Singleton stanu, pętla telemetrii, obsługa mutacji parametrów | `modules/` | PRODUKCYJNY |
| `core.tsx` | Nadrzędny komponent React, orkiestracja zakładek z AnimatePresence | `core.ts`, `modules/components/` | PRODUKCYJNY |
| `system_explainer.html` | Samodzielny, interaktywny Master Explainer w HTML5 (Apple Design) | `system_explainer.js`, `system_explainer.css` | PRODUKCYJNY |
| `system_explainer.css` | Modułowy arkusz stylów Master Explainer (Apple tokens, szkło, stany) | Brak | PRODUKCYJNY |
| `system_explainer.js` | Kontroler UI, kalkulatory i symulator cząstek DOM (Zero innerHTML) | Brak (Zero-Dep) | PRODUKCYJNY |
| `modules/components/SystemExplainer.tsx` | Moduł wyjaśniający cały system (Tab 6 w React) | React, Framer Motion | PRODUKCYJNY |
| `README.md` | Główna wizytówka na GitHubie, diagramy, live demo, tabele | Wszystkie moduły | PRODUKCYJNY |
| `LICENSE` | Licencja MIT z klauzulą badawczo-edukacyjną | Brak | PRODUKCYJNY |
| `.github/workflows/ci-cd.yml` | Pipeline GitHub Actions (typecheck, build, deploy GH Pages) | Node 22 / Vite | PRODUKCYJNY |
| `modules/camouflage-worker/worker.js` | Reverse proxy Cloudflare Workers dla Węzła 2 (ECH blind forwarder) | Fetch API | PRODUKCYJNY |
| `modules/webtunnel-proxy/` | Konfiguracja Caddy / Nginx z kamuflażem strony WWW i WebTunnel | Nginx / Caddy | PRODUKCYJNY |
| `modules/panzer-core/` | Szkielet demona w Rust dla Węzła 3 (Tokio, Poisson Stop-and-Go) | Rust / Tokio | PROTOTYP (Faza 2) |
| `data/finanse/BOM_CALCULATION.md` | Zestawienie kosztów BOM dla 3 wariantów | Specyfikacja L1-L7 | ZWERYFIKOWANY |
| `data/scans/NIST_SP800_22_RESULTS.json` | Wyniki laboratoryjnych testów losowości ładunku ramki | NIST SP 800-22 | ZWERYFIKOWANY |
| `data/reports/ZERO_LEAK_AUDIT_REPORT.md` | Raport 24h pasywnego audytu Hardware TAP | Wireshark / tcpdump | ZWERYFIKOWANY |
| `data/reports/KS_TIMING_CORRELATION_TEST.md` | Wyniki testu statystycznego korelacji czasowej GPA-R | Rozkład Poissona | ZWERYFIKOWANY |

---

## 3. DŁUG TECHNICZNY I STATUS ZADAŃ

| ID | Kategoria | Opis | Priorytet | Status |
| :--- | :--- | :--- | :--- | :--- |
| DT-001 | Implementacja | Opracowanie interaktywnej platformy Digital Twin w React + TS + Tailwind | WYSOKI | ZREALIZOWANO ✅ |
| DT-002 | Moduły | Implementacja dekonstruktora ramek i kalkulatora entropii Shannona | ŚREDNI | ZREALIZOWANO ✅ |
| DT-003 | Apple Design | Integracja fizyki sprężynowej, materiałów szklanych i bezpośredniej manipulacji | ŚREDNI | ZREALIZOWANO ✅ |
| DT-004 | Obsidian Sync | Pełna replikacja dokumentacji w `C:\Users\Jakub Lis\Documents\OBSIDIAN\PROJEKTY\PanzerNetworking\` | KRYTYCZNY | ZREALIZOWANO ✅ |
| DT-005 | Repozytorium GitHub | Kompletny zestaw produkcyjny (CI/CD, LICENSE, README, dane lab, szablony) | WYSOKI | ZREALIZOWANO ✅ |
| DT-006 | Rust Core | Kompilacja i wdrożenie produkcyjne demona `panzer-core` w Rust | ŚREDNI | SZKIELET WDROŻONY ✅ |
| DT-007 | Master Explainer | Wdrożenie samodzielnej strony `system_explainer.html` oraz Tab 6 `SystemExplainer.tsx` | KRYTYCZNY | ZREALIZOWANO ✅ |
