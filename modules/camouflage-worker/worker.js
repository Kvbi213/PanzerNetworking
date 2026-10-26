/**
 * PanzerNetworking Node 2: Camouflage Edge Worker
 * Target: Cloudflare Workers (Serverless Anycast Edge)
 * Standard: Antigravity Protocol (NANO v3.5)
 *
 * Responsibilities:
 * 1. Accepts incoming TLS 1.3 / ECH steganographic envelope from Node 1 (Point A DropBox).
 * 2. Decouples client IP from destination metadata.
 * 3. Blind forwarder: does not hold payload decryption keys.
 * 4. Relays raw binary 1400 B stream to Node 3 (Residential Mixnode).
 */

export default {
  async fetch(request, env, ctx) {
    // Only accept POST requests with application/octet-stream
    if (request.method !== 'POST') {
      return new Response('404 Not Found', { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/octet-stream')) {
      return new Response('400 Bad Request', { status: 400 });
    }

    // Verify minimum payload size matching MTU 1400 B
    const arrayBuffer = await request.arrayBuffer();
    if (arrayBuffer.byteLength !== 1400) {
      return new Response('422 Unprocessable Frame', { status: 422 });
    }

    const upstreamUrl = env.NODE3_RELAY_ENDPOINT || 'https://residential-mixnode.local:8443/ingress';

    try {
      // Blind relay to Node 3 Residential Mixnode
      const forwardResponse = await fetch(upstreamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Panzer-Transit': 'EDGE-WORKER-HOP2',
        },
        body: arrayBuffer,
      });

      return new Response(forwardResponse.body, {
        status: forwardResponse.status,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    } catch (err) {
      return new Response('502 Bad Gateway', { status: 502 });
    }
  },
};
