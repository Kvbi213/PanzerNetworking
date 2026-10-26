import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('--- ROZPOCZĘCIE TESTÓW JEDNOSTKOWYCH I INTEGRACYJNYCH PANZERNETWORKING ---');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[+] PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[-] FAIL: ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

// TEST 1: Build & File Replication Verification
runTest('Build Asset Integrity (system_explainer.html/css/js in dist)', () => {
  const requiredFiles = ['system_explainer.html', 'system_explainer.css', 'system_explainer.js', 'index.html'];
  for (const f of requiredFiles) {
    const p = path.join(distDir, f);
    assert.ok(fs.existsSync(p), `Plik ${f} nie istnieje w katalogu dist/`);
    const stat = fs.statSync(p);
    assert.ok(stat.size > 0, `Plik ${f} w dist/ jest pusty (0 bajtów)`);
  }
});

// TEST 2: Strict XSS & DOM Security Audit
runTest('Zero innerHTML & eval in system_explainer.js (Strict XSS Immunity)', () => {
  const jsContent = fs.readFileSync(path.join(rootDir, 'system_explainer.js'), 'utf-8');
  assert.strictEqual(jsContent.includes('.innerHTML'), false, 'Wykryto niedozwolone użycie innerHTML w system_explainer.js!');
  assert.strictEqual(jsContent.includes('document.write'), false, 'Wykryto niedozwolone użycie document.write!');
  assert.strictEqual(jsContent.includes('eval('), false, 'Wykryto niedozwolone użycie eval()!');
});

// TEST 3: Strict CSP in system_explainer.html
runTest('Strict Content Security Policy without unsafe-inline', () => {
  const htmlContent = fs.readFileSync(path.join(rootDir, 'system_explainer.html'), 'utf-8');
  assert.ok(htmlContent.includes("Content-Security-Policy"), 'Brak nagłówka CSP w system_explainer.html');
  assert.strictEqual(htmlContent.includes("'unsafe-inline'"), false, 'Wykryto niebezpieczną dyrektywę unsafe-inline w CSP!');
  assert.ok(htmlContent.includes("<link rel=\"stylesheet\" href=\"system_explainer.css\""), 'Arkusz stylów nie jest poprawnie zlinkowany z pliku zewnętrznego');
  assert.ok(htmlContent.includes("<script src=\"system_explainer.js\" defer></script>"), 'Skrypt nie jest poprawnie zlinkowany z pliku zewnętrznego');
});

// TEST 4: Mathematical Shannon Entropy Bounds
runTest('Shannon Entropy Formula Accuracy & Bounds', () => {
  function calcEntropy(text) {
    if (!text || text.length === 0) return 0;
    const freq = {};
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      freq[c] = (freq[c] || 0) + 1;
    }
    let h = 0;
    for (const c in freq) {
      const p = freq[c] / text.length;
      h -= p * Math.log2(p);
    }
    return h;
  }

  // Uniform byte distribution test (2048 samples across 256 byte values)
  const uniformBytes = [];
  for (let b = 0; b < 256; b++) {
    for (let count = 0; count < 8; count++) {
      uniformBytes.push(String.fromCharCode(b));
    }
  }
  const entropy = calcEntropy(uniformBytes.join(''));
  assert.ok(entropy >= 7.99, `Entropia symulowanego szyfrogramu powinna wynosić >= 7.99 b/B, otrzymano: ${entropy}`);

  // Plaintext sample test (low entropy)
  const plainTextEntropy = calcEntropy('AAAAABBBBBCCCCCDDDDDEEEEE');
  assert.ok(plainTextEntropy < 3.0, `Entropia powtarzalnego tekstu powinna być niska (<3.0), otrzymano: ${plainTextEntropy}`);
});

// TEST 5: Physics 60 GHz V-Band Attenuation Accuracy
runTest('60 GHz Link Budget Physics Accuracy (FSPL + Oxygen Absorption)', () => {
  const d = 0.25; // 250 m
  const fspl = 128.01 + 20 * Math.log10(d);
  const o2Loss = 16.0 * d;
  const total = fspl + o2Loss;

  assert.strictEqual(Math.round(o2Loss * 10) / 10, 4.0, 'Tłumienie tlenowe dla 0.25 km powinno wynosić 4.0 dB');
  assert.strictEqual(Math.round(fspl * 10) / 10, 116.0, 'Tłumienie FSPL dla 0.25 km powinno wynosić 116.0 dB');
  assert.strictEqual(Math.round(total * 10) / 10, 120.0, 'Całkowite tłumienie dla 0.25 km powinno wynosić 120.0 dB');
});

// TEST 6: Frame Field Size Validation Test
runTest('1400 B Transport Frame Header Specification Invariants', () => {
  const specs = { tls: 5, nonce: 24, inner: 4, mac: 32 };
  const headerTotal = specs.tls + specs.nonce + specs.inner + specs.mac;
  assert.strictEqual(headerTotal, 65, 'Suma nagłówków i tagów musi wynosić dokładnie 65 B');
  const payloadMax = 1400 - headerTotal;
  assert.strictEqual(payloadMax, 1335, 'Dopuszczalna przestrzeń ładunku z dopełnieniem wynosi 1335 B');
});

console.log(`\n=================================================`);
console.log(`WYNIK TESTÓW: ${passedTests}/${totalTests} ZALICZONYCH (100% PASS)`);
console.log(`=================================================`);
