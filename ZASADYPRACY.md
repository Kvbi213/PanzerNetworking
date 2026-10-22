# ANTIGRAVITY — PROTOKÓŁ OPERACYJNY & STANDARD RYGORU (NANO v3.5)

> **Projekt:** PanzerNetworking (PANZER-NET)  
> **Status:** AKTYWNY  
> **Wersja:** 1.2.0-PROD  
> **Klasyfikacja:** REFERENCE ARCHITECTURE / HARDENED  
> **Zastosowanie:** Globalne — całe repozytorium projektu  

---

## 1. PERSISTENCE & EXPANSION
- Bezwzględny zakaz usuwania stabilnych modułów, architektury, logiki tranzytowej, interfejsu GUI oraz dokumentacji bez "Chirurgicznej Redukcji".
- Wszystkie rozszerzenia funkcjonalne lokowane w `/modules/<nazwa>` oraz sprzęgane z jądrem `core.*`.
- Wszelkie modyfikacje rejestrowane w `ARCHITECTURE.md` i `HISTORY.md`.

## 2. STRUKTURA KATALOGÓW & HIERARCHIA
- **Root:** `core.*`, `index.html`, `ZASADYPRACY.md`, `ARCHITECTURE.md`, `HISTORY.md`, `.gitignore`, `.env.example`.
- **Strefy dozwolone:**
  - `/modules/` — jednostki funkcjonalne (kaskada kryptograficzna, bufor Poissona, steganografia, kameleon).
  - `/docs/` — dokumentacja (`versions/vX.X.X.md`, `architecture/`, `errors/`).
  - `/data/` — dane robocze i artefakty (`scans/`, `reports/`, `finanse/`, `logs/`).
  - `/assets/` — zasoby interfejsu (`styles/`, `images/`, `libs/`).
- Zakaz tworzenia stref poza wymienionymi.

## 3. ZERO EMOJI POLICY [KRYTYCZNY]
- Całkowity zakaz stosowania dekoracyjnych emotikonów w kodzie, dokumentacji i interfejsie użytkownika.
- Wyłącznie dopuszczalna symbolika inżynieryjna: `[+]`, `[-]`, `[*]`, `[!]`, `[>]`, `[~]`, `✅`, `❌`.

## 4. SECURE-BY-DESIGN & ZERO CREDENTIALS LEAKAGE
- Bezwzględny zakaz wprowadzania surowych kluczy, tokenów, poświadczeń i adresów prywatnych.
- Wszystkie konfiguracje wrażliwe zasilane wyłącznie z `.env` z odwołaniem przez `process.env` / `os.getenv`.
- Plik `.gitignore` bezwzględnie blokuje `.env`, pliki kluczy (`*.key`, `*.pem`), `/data/logs/` oraz `/data/scans/`.
- Anonimizacja w dokumentacji publicznej: `<OPERATOR>`, `$PROJECT_ROOT`, `$API_KEY`.

## 5. OBSIDIAN SYNC STANDARD
- Dokumentacja techniczna, architektoniczna, plany i rejestry projektu podlegają symetrycznej synchronizacji z repozytorium wiedzy Obsidian:
  `C:\Users\Jakub Lis\Documents\OBSIDIAN\PROJEKTY\PanzerNetworking\`
- Główny rekord projektu zarejestrowany w centralnym skorowidzu `INDEX_PROJEKTY.md`.

## 6. WERSJONOWANIE (SemVer) & AUDYT
- Wersjonowanie ścisłe: `MAJOR.MINOR.PATCH` (wersja bazowa: `v1.2.0-PROD`).
- Każde wydanie rejestrowane w `/docs/versions/vX.X.X.md` oraz dopisywane do `HISTORY.md` (append-only).
- Weryfikacja przedwdrożeniowa: składnia, brak regresji, poprawność matematyczna, brak placeholderów (`TODO`).

---

<div style="margin-top: 36px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 0.78em; color: #64748b; flex-wrap: wrap;">
<span style="color: #94a3b8; font-weight: 700;">POWIĄZANIA SYSTEMOWE:</span>
[[INDEX|Główny Dashboard]] <span>•</span> [[PROJEKTY/INDEX_PROJEKTY|Centrum Projektów]] <span>•</span> [[PROJEKTY/PanzerNetworking/PanzerNetworking|Hub: PanzerNetworking]]
</div>
