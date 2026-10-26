/**
 * PanzerNetworking Transport Frame Types (MTU 1400 Bytes)
 * Standard: Antigravity Protocol (NANO v3.5) / RFC 8441 Steganography
 */

export type PacketTypeFlag = 0x01 | 0xFF; // 0x01 = Real Data, 0xFF = Dummy Chaff

export interface TransportFrame {
  readonly length: 1400; // Fixed 1400 B MTU
  tlsHeader: {
    contentType: 0x17; // Application Data
    version: 0x0303;    // TLS 1.2/1.3 legacy record version
    length: 1395;       // 1400 - 5 header bytes
  };
  nonceXChaCha: Uint8Array; // 24 bytes (192-bit extended nonce)
  innerHeader: {
    packetType: PacketTypeFlag;
    payloadLength: number;
    reserved: 0x00;
  };
  encryptedPayload: Uint8Array;
  randomPadding: Uint8Array;
  aesGcmTag: Uint8Array;    // 16 bytes auth tag (Node 4 integrity)
  poly1305Tag: Uint8Array;  // 16 bytes auth tag (Node 3 integrity)
}

export interface HopInspectionData {
  hopIndex: number;
  nodeName: string;
  osiLayer: string;
  isEncrypted: boolean;
  activeShell: string;
  entropy: number;
  rawHex: string;
  asciiPreview: string;
  visibleFields: Record<string, string>;
  hiddenFields: Record<string, string>;
  description: string;
}
