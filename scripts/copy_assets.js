import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Ensure dist directory exists and is writable
try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.accessSync(distDir, fs.constants.W_OK);
} catch (err) {
  console.error(`[!] BŁĄD KRYTYCZNY :: Katalog dist/ nie jest dostępny do zapisu: ${err.message}`);
  process.exit(1);
}

const assetsToCopy = [
  'system_explainer.html',
  'system_explainer.css',
  'system_explainer.js'
];

let copiedCount = 0;
for (const file of assetsToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);

  if (!fs.existsSync(src)) {
    console.error(`[!] BŁĄD KRYTYCZNY :: Brak wymaganego pliku źródłowego: ${file}`);
    process.exit(1);
  }

  try {
    fs.copyFileSync(src, dest);
    copiedCount++;
  } catch (copyErr) {
    console.error(`[!] BŁĄD KOPIOWANIA pliku ${file}: ${copyErr.message}`);
    process.exit(1);
  }
}

console.info(`[+] SUCCESS :: Pomyślnie zsynchronizowano ${copiedCount}/${assetsToCopy.length} zasobów w katalogu dist/.`);
