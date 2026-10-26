/**
 * PanzerNetworking Poisson Jitter Engine & Particle Physics Simulator
 * Memorylessness verification & Stop-and-Go Queue Management
 */

export interface SimulationParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  currentNodeIndex: number;
  isChaff: boolean;
  isDpiProbe: boolean;
  alpha: number;
  delayRemainingMs: number;
  inBuffer: boolean;
  size: number;
}

export class PoissonEngine {
  private lambda: number; // np. 20 (odpowiada średniemu opóźnieniu 50 ms)
  private bufferQueue: SimulationParticle[] = [];

  constructor(initialLambda: number = 20) {
    this.lambda = Math.max(1, initialLambda);
  }

  public setLambda(newLambda: number): void {
    this.lambda = Math.max(1, newLambda);
  }

  public getLambda(): number {
    return this.lambda;
  }

  /**
   * Generuje czas opóźnienia t z ciągłego rozkładu wykładniczego
   * Metoda odwracania dystrybuanty: t = -ln(1 - U) / lambda
   * Wynik w milisekundach.
   */
  public sampleExponentialDelayMs(): number {
    const u = Math.random();
    // Średnia = 1 / lambda sekund = 1000 / lambda milisekund
    const delaySeconds = -Math.log(1 - u) / (this.lambda / 10);
    return Math.max(2, delaySeconds * 100);
  }

  /**
   * Symulacja własności braku pamięci (Memorylessness):
   * P(T > s + t | T > s) = P(T > t)
   */
  public verifyMemorylessness(s: number, t: number, trials: number = 10000): { pGiven: number; pBase: number; isMemoryless: boolean } {
    let countBoth = 0;
    let countS = 0;
    let countT = 0;

    for (let i = 0; i < trials; i++) {
      const delay = this.sampleExponentialDelayMs();
      if (delay > s) countS++;
      if (delay > s + t) countBoth++;
      if (delay > t) countT++;
    }

    const pGiven = countS > 0 ? countBoth / countS : 0;
    const pBase = countT / trials;
    const diff = Math.abs(pGiven - pBase);

    return {
      pGiven: Number(pGiven.toFixed(4)),
      pBase: Number(pBase.toFixed(4)),
      isMemoryless: diff < 0.05,
    };
  }

  public enqueueToBuffer(particle: SimulationParticle): void {
    particle.inBuffer = true;
    particle.delayRemainingMs = this.sampleExponentialDelayMs();
    this.bufferQueue.push(particle);
  }

  public updateBuffer(deltaMs: number): SimulationParticle[] {
    const released: SimulationParticle[] = [];
    this.bufferQueue = this.bufferQueue.filter((p) => {
      p.delayRemainingMs -= deltaMs;
      if (p.delayRemainingMs <= 0) {
        p.inBuffer = false;
        released.push(p);
        return false;
      }
      return true;
    });
    return released;
  }

  public getBufferCount(): number {
    return this.bufferQueue.length;
  }
}
