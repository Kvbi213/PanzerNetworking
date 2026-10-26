/**
 * 6-Node Transit Pipeline Architecture Definitions (Nodes 0 to 5)
 */

export interface TransitNode {
  id: number;
  label: string;
  role: string;
  hardware: string;
  layer: string;
  technology: string;
  mitigation: string;
  status: 'idle' | 'processing' | 'forwarding' | 'alert';
  averageLatencyMs: number;
  dataRate: string;
}

export const TRANSIT_NODES_CONFIG: readonly TransitNode[] = [
  {
    id: 0,
    label: 'WĘZEŁ 0: STACJA ROBOCZA',
    role: 'Workstation (RAM-Only)',
    hardware: 'Lenovo ThinkPad T480 / Coreboot (No internal drives/WiFi)',
    layer: 'OSI L7 / Host',
    technology: 'Tails OS / Whonix + Moduł Kameleon + Cold-Boot RAM wipe (<300ms)',
    mitigation: 'Brak śladu na dysku, wyłączenie zrzutów pamięci, normalizacja biometrii',
    status: 'idle',
    averageLatencyMs: 0.1,
    dataRate: '1 Gbps (USB Ethernet)',
  },
  {
    id: 1,
    label: 'WĘZEŁ 1: MOST RADIOWY 60 GHz',
    role: 'Pencil Beam Physical Bypass',
    hardware: 'MikroTik Wireless Wire wAP 60G (802.11ad/ay)',
    layer: 'OSI L1 / L2',
    technology: 'Pencil Beam 60 GHz V-Band (<1.5°), absorpcja tlenowa O2 (16 dB/km), MACsec L2',
    mitigation: 'Fizyczny bypass lokalnego ISP, LPI/LPD (Low Probability of Intercept)',
    status: 'idle',
    averageLatencyMs: 0.8,
    dataRate: '1 Gbps Full-Duplex',
  },
  {
    id: 2,
    label: 'WĘZEŁ 2: CHMURA ANYCAST CDN',
    role: 'Camouflage Edge Worker',
    hardware: 'Cloudflare Workers / Edge Serverless Anycast',
    layer: 'OSI L4 / L7',
    technology: 'TLS 1.3 + Encrypted Client Hello (ECH), maskowanie SNI, Anycast IP',
    mitigation: 'Ukrycie docelowej subdomeny, ISP widzi tylko ruch do infrastruktury CDN',
    status: 'idle',
    averageLatencyMs: 14.5,
    dataRate: 'High Throughput',
  },
  {
    id: 3,
    label: 'WĘZEŁ 3: WĘZEŁ MIESZAJĄCY P2P',
    role: 'Residential Mixnode (Jitter & Chaff)',
    hardware: 'Raspberry Pi 5 / Mikroserwer na łączu domowym',
    layer: 'Mixnet Layer',
    technology: 'Algorytm Stop-and-Go Mix, rozkład Poissona, stałe MTU 1400 B, ruch Dummy Chaff',
    mitigation: 'Neutralizacja pasywnej korelacji czasowej GPA i analizy objętości pakietów',
    status: 'idle',
    averageLatencyMs: 42.0,
    dataRate: 'Constant Bitrate (CBR)',
  },
  {
    id: 4,
    label: 'WĘZEŁ 4: WEBTUNNEL VPS',
    role: 'Ingress Proxy 2 (Cover Web)',
    hardware: 'VPS Offshore (Islandia/Szwajcaria, opłacony Monero XMR bez KYC)',
    layer: 'OSI L7 Ingress',
    technology: 'Caddy/Nginx (Kamuflaż bloga HTML) + HTTP/2 WebSocket Upgrade (RFC 8441)',
    mitigation: 'Odporność na aktywne sondy DPI (Active Probing Resistance) - zwraca stronę 200 OK',
    status: 'idle',
    averageLatencyMs: 24.0,
    dataRate: '1 Gbps Uplink',
  },
  {
    id: 5,
    label: 'WĘZEŁ 5: OBWÓD CEBULOWY TOR',
    role: '3-Hop Circuit + Stream Isolation',
    hardware: 'Rozproszona sieć węzłów Tor (Guard -> Middle -> Exit)',
    layer: 'Onion Routing',
    technology: 'Potrójny szyfr cebulowy Tor (komórki 514 B) + IsolateSOCKSAuth',
    mitigation: 'Oddzielenie tożsamości nadawcy od docelowego serwera, izolacja kart/domen',
    status: 'idle',
    averageLatencyMs: 148.0,
    dataRate: '30-80 Mbps',
  },
];
