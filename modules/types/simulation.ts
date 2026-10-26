/**
 * Simulation Parameters, Metrics, and Persona Configuration
 */

export type PersonaMode = 'GHOST' | 'BURNER' | 'MULTI_PERSONA';

export interface PersonaProfile {
  mode: PersonaMode;
  title: string;
  badge: string;
  targetView: string;
  canvasSeed: number;
  mouseJitterEnabled: boolean;
  dnsSecLockdown: boolean;
  activeCircuits: number;
  description: string;
}

export interface SimulationParams {
  packetsPerSecond: number; // 1 to 100 PPS
  poissonLambda: number;     // 5 to 250 ms jitter intensity
  constantCoverEnabled: boolean; // CBR Dummy Chaff
  activePersona: PersonaMode;
  dpiProbingActive: boolean;
  isPaused: boolean;
}

export interface SimulationMetrics {
  totalPacketsSent: number;
  realDataPackets: number;
  chaffPackets: number;
  averageEntropy: number;
  currentLatencyMs: number;
  keysRatchetedCount: number;
  secondsToNextRatchet: number;
  activePps: number;
  bufferOccupancy: number; // 0 to 100%
}
