/**
 * PanzerNetworking Core Simulation Engine & State Coordinator
 * Standard: Antigravity Protocol (NANO v3.5)
 */

import { SimulationParams, SimulationMetrics, PersonaMode } from './modules/types/simulation';
import { PoissonEngine } from './modules/physics/poisson_engine';
import { KameleonEngine } from './modules/kameleon/persona_engine';

export type StateListener = (params: SimulationParams, metrics: SimulationMetrics) => void;

export class PanzerCore {
  private static instance: PanzerCore | null = null;

  public params: SimulationParams = {
    packetsPerSecond: 24,
    poissonLambda: 20,
    constantCoverEnabled: true,
    activePersona: 'GHOST',
    dpiProbingActive: false,
    isPaused: false,
  };

  public metrics: SimulationMetrics = {
    totalPacketsSent: 1842,
    realDataPackets: 1205,
    chaffPackets: 637,
    averageEntropy: 7.9994,
    currentLatencyMs: 230.4,
    keysRatchetedCount: 18,
    secondsToNextRatchet: 42,
    activePps: 24,
    bufferOccupancy: 38,
  };

  public poisson: PoissonEngine;
  public kameleon: KameleonEngine;
  private listeners: Set<StateListener> = new Set();
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.poisson = new PoissonEngine(this.params.poissonLambda);
    this.kameleon = new KameleonEngine(this.params.activePersona);
    this.startTelemetryLoop();
  }

  public static getInstance(): PanzerCore {
    if (!PanzerCore.instance) {
      PanzerCore.instance = new PanzerCore();
    }
    return PanzerCore.instance;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    try {
      listener({ ...this.params }, { ...this.metrics });
    } catch (err) {
      console.error('[!] ALERT :: PanzerCore listener error:', err);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const p = { ...this.params };
    const m = { ...this.metrics };
    this.listeners.forEach((fn) => {
      try {
        fn(p, m);
      } catch (err) {
        console.error('[!] ALERT :: PanzerCore notification error:', err);
      }
    });
  }

  public updateParams(updater: Partial<SimulationParams> | ((prev: SimulationParams) => Partial<SimulationParams>)): void {
    try {
      const delta = typeof updater === 'function' ? updater({ ...this.params }) : updater;
      this.params = { ...this.params, ...delta };
      if (delta.poissonLambda !== undefined) {
        this.poisson.setLambda(delta.poissonLambda);
      }
      if (delta.activePersona !== undefined) {
        this.kameleon.setMode(delta.activePersona);
      }
      this.notify();
    } catch (err) {
      console.error('[!] ALERT :: Failed to update simulation params:', err);
    }
  }

  public setPersona(mode: PersonaMode): void {
    this.updateParams({ activePersona: mode });
  }

  public triggerChaffBurst(count: number = 25): void {
    try {
      this.metrics.totalPacketsSent += count;
      this.metrics.chaffPackets += count;
      this.metrics.bufferOccupancy = Math.min(100, this.metrics.bufferOccupancy + 25);
      this.notify();
    } catch (err) {
      console.error('[!] ALERT :: Failed to trigger chaff burst:', err);
    }
  }

  public triggerDpiProbe(): void {
    try {
      this.params.dpiProbingActive = true;
      this.notify();
      setTimeout(() => {
        this.params.dpiProbingActive = false;
        this.notify();
      }, 3500);
    } catch (err) {
      console.error('[!] ALERT :: Failed to trigger DPI probe:', err);
    }
  }

  private startTelemetryLoop(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.params.isPaused) return;

      // Odliczanie do PFS Ratchet
      if (this.metrics.secondsToNextRatchet <= 1) {
        this.metrics.secondsToNextRatchet = 60;
        this.metrics.keysRatchetedCount += 1;
      } else {
        this.metrics.secondsToNextRatchet -= 1;
      }

      // Przyrost pakietów
      const ppsFactor = Math.round(this.params.packetsPerSecond / 2);
      this.metrics.activePps = this.params.packetsPerSecond + Math.floor(Math.sin(Date.now() / 1000) * 3);
      this.metrics.totalPacketsSent += ppsFactor;
      
      if (this.params.constantCoverEnabled) {
        const chaffPortion = Math.floor(ppsFactor * 0.4);
        this.metrics.chaffPackets += chaffPortion;
        this.metrics.realDataPackets += (ppsFactor - chaffPortion);
      } else {
        this.metrics.realDataPackets += ppsFactor;
      }

      // Fluktuacje entropii Shannona (zawsze w normie > 7.999 b/B)
      const noise = (Math.random() - 0.5) * 0.0006;
      this.metrics.averageEntropy = Number((7.9994 + noise).toFixed(4));

      // Bufor Stop-and-Go
      const targetOccupancy = Math.min(95, Math.max(10, Math.round(this.params.poissonLambda * 1.5 + Math.random() * 8)));
      this.metrics.bufferOccupancy = targetOccupancy;

      this.notify();
    }, 1000);
  }
}

export const panzerCore = PanzerCore.getInstance();
