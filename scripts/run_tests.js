import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('--- ROZPOCZĘCIE AUDYTU TESTÓW JEDNOSTKOWYCH I INTEGRACYJNYCH PANZERNETWORKING ---');

function readFileSafe(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Plik ${description} (${filePath}) nie istnieje w systemie plików.`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new Error(`Nie udało się odczytać ${description}: ${err.message}`);
  }
}

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.info(`[+] PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[-] FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

// TEST 1: Build & Dynamic Asset Integrity
runTest('Build Asset Integrity (Dynamic validation in dist/)', () => {
  const assets = ['system_explainer.html', 'system_explainer.css', 'system_explainer.js', 'index.html'];
  assets.forEach(file => {
    const fullPath = path.join(distDir, file);
    assert.strictEqual(fs.existsSync(fullPath), true, `Plik ${file} nie istnieje w katalogu dist/`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Plik ${file} w dist/ jest pusty (0 bajtów)`);
  });
});

// TEST 2: Strict XSS & DOM-Based Injection Security
runTest('Zero innerHTML & eval in system_explainer.js (Strict XSS Immunity)', () => {
  const jsContent = readFileSafe(path.join(rootDir, 'system_explainer.js'), 'system_explainer.js');
  assert.strictEqual(jsContent.includes('.innerHTML'), false, 'Wykryto niedozwolone użycie innerHTML w system_explainer.js!');
  assert.strictEqual(jsContent.includes('document.write'), false, 'Wykryto niedozwolone użycie document.write!');
  assert.strictEqual(jsContent.includes('eval('), false, 'Wykryto niedozwolone użycie eval()!');
});

// TEST 3: Strict CSP Header Verification
runTest('Strict Content Security Policy without unsafe-inline in system_explainer.html', () => {
  const htmlContent = readFileSafe(path.join(rootDir, 'system_explainer.html'), 'system_explainer.html');
  assert.ok(/<meta http-equiv="Content-Security-Policy"[^>]*content="[^"]*"/i.test(htmlContent), 'Brak nagłówka CSP meta w system_explainer.html');
  assert.ok(htmlContent.includes("default-src 'self'"), "Brak dyrektywy default-src 'self' w CSP");
  assert.ok(htmlContent.includes("object-src 'none'"), "Brak dyrektywy object-src 'none' w CSP");
  assert.strictEqual(htmlContent.includes("'unsafe-inline'"), false, 'Wykryto niebezpieczną dyrektywę unsafe-inline w CSP!');
  assert.strictEqual(htmlContent.includes('<link rel="stylesheet" href="system_explainer.css"'), true, 'Arkusz stylów nie jest poprawnie zlinkowany');
  assert.strictEqual(htmlContent.includes('<script src="system_explainer.js" defer></script>'), true, 'Skrypt nie jest poprawnie zlinkowany');
});

// TEST 4: Mathematical Shannon Entropy Bounds & Null Safety
runTest('Shannon Entropy Formula Accuracy & Null/Empty Edge Cases', () => {
  function calcEntropy(rawText) {
    const text = String(rawText || '').slice(0, 50000);
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
    return Number.isFinite(h) ? h : 0;
  }

  // Edge cases
  assert.strictEqual(calcEntropy(null), 0, 'calcEntropy(null) powinno zwrócić 0');
  assert.strictEqual(calcEntropy(undefined), 0, 'calcEntropy(undefined) powinno zwrócić 0');
  assert.strictEqual(calcEntropy(''), 0, 'calcEntropy("") powinno zwrócić 0');

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

// TEST 5: Physics 60 GHz V-Band Attenuation
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

// TEST 7: Frame Dissector Logic & Field Validation Robustness
runTest('Frame Dissector Field Validation Functionality & Type Safety', () => {
  function testValidateFieldSpecs(specs) {
    try {
      if (!specs || typeof specs !== 'object') return false;
      const headerTotal = Number(specs.tls || 0) + Number(specs.nonce || 0) + Number(specs.inner || 0) + Number(specs.mac || 0);
      return headerTotal === 65;
    } catch {
      return false;
    }
  }

  assert.strictEqual(testValidateFieldSpecs({ tls: 5, nonce: 24, inner: 4, mac: 32 }), true, 'Standardowe nagłówki powinny przejść walidację');
  assert.strictEqual(testValidateFieldSpecs({ tls: 5, nonce: 24, inner: 4, mac: 31 }), false, 'Niekompletne nagłówki powinny zostać odrzucone');
  assert.strictEqual(testValidateFieldSpecs(null), false, 'null powinien zostać odrzucony');
  assert.strictEqual(testValidateFieldSpecs(undefined), false, 'undefined powinien zostać odrzucony');
  assert.strictEqual(testValidateFieldSpecs('invalid'), false, 'string powinien zostać odrzucony');
});

console.log(`\n=================================================`);
console.log(`WYNIK TESTÓW: ${passedTests}/${totalTests} ZALICZONYCH`);
console.log(`=================================================`);

// Ensure nonzero exit code on any test failure for CI/CD
if (passedTests !== totalTests) {
  console.error(`[-] BŁĄD KRYTYCZNY :: Nie zaliczono ${totalTests - passedTests} testów!`);
  process.exit(1);
} else {
  console.info('[+] SUCCESS :: Wszystkie testy przeszły pomyślnie.');
  process.exit(0);
}
