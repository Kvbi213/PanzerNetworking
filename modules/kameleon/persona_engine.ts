/**
 * PanzerNetworking Kameleon Engine
 * Application-Layer Anti-Fingerprinting & Multi-Persona Manager
 */

import { PersonaMode, PersonaProfile } from '../types/simulation';

export const PERSONA_PROFILES: Record<PersonaMode, PersonaProfile> = {
  GHOST: {
    mode: 'GHOST',
    title: 'GHOST / STEALTH',
    badge: 'Ochrona Antybotowa & Maskowanie Domowe',
    targetView: 'Windows 11 + Google Chrome 128 (Użytkownik Domowy)',
    canvasSeed: 0x4A7B9C1D,
    mouseJitterEnabled: true,
    dnsSecLockdown: true,
    activeCircuits: 1,
    description: 'Wyjście przez selekcjonowany Exit Node lub VPS z czystym adresem IP. Spoofing popularnego profilu przeglądarki. Zero wyzwań Cloudflare Turnstile czy reCAPTCHA.',
  },
  BURNER: {
    mode: 'BURNER',
    title: 'BURNER / ISOLATE',
    badge: 'Maksymalna Anonimowość (OSINT/Darknet)',
    targetView: 'Zunifikowany Tor Browser (Safest Level, JS Disabled)',
    canvasSeed: 0x00000000,
    mouseJitterEnabled: true,
    dnsSecLockdown: true,
    activeCircuits: 1,
    description: 'Pełna 6-węzłowa kaskada tranzytowa. Całkowicie wyłączony JavaScript, WebGL i czcionki zdalne. Po zamknięciu sesji kontener w pamięci RAM ulega natychmiastowej destrukcji.',
  },
  MULTI_PERSONA: {
    mode: 'MULTI_PERSONA',
    title: 'MULTI-PERSONA',
    badge: 'Rozbicie Tożsamości Krzyżowej',
    targetView: '3 Niezależne Środowiska (Każda karta = inny komputer i kraj)',
    canvasSeed: 0x9F3E1B7A,
    mouseJitterEnabled: true,
    dnsSecLockdown: true,
    activeCircuits: 3,
    description: 'Równoległe operacje bez ryzyka korelacji cross-site. Każda karta przeglądarki korzysta z osobnego ziarna szumu Canvas/Audio oraz niezależnego obwodu Tor (IsolateSOCKSAuth).',
  },
};

export class KameleonEngine {
  private currentMode: PersonaMode = 'GHOST';

  constructor(initialMode: PersonaMode = 'GHOST') {
    this.currentMode = initialMode;
  }

  public setMode(mode: PersonaMode): void {
    this.currentMode = mode;
  }

  public getProfile(): PersonaProfile {
    return PERSONA_PROFILES[this.currentMode];
  }

  /**
   * Generuje deterministyczny szum Canvas wstrzykiwany do pikseli (Canvas Poisoning)
   */
  public generateCanvasNoise(x: number, y: number): number {
    const seed = PERSONA_PROFILES[this.currentMode].canvasSeed;
    if (seed === 0) return 0; // W trybie Burner brak canvasu
    const val = (Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453) % 1;
    return (val - 0.5) * 2; // Odchylenie rzędu [-1, 1] w kanale piksela
  }

  /**
   * Symulacja normalizacji biometrii pisania (Dwell Time & Flight Time)
   */
  public normalizeKeystrokeTiming(rawIntervalMs: number): number {
    if (!PERSONA_PROFILES[this.currentMode].mouseJitterEnabled) return rawIntervalMs;
    // Wygładzanie rozkładu interwałów do znormalizowanej mediany 80-120 ms
    const targetMedian = 100;
    const smoothed = rawIntervalMs * 0.4 + targetMedian * 0.6;
    return Math.round(smoothed);
  }
}
