import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
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

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    copiedCount++;
  } else {
    console.warn(`[!] OSTRZEŻENIE :: Brak pliku źródłowego: ${file}`);
  }
}

console.log(`[+] SUCCESS :: Skopiowano ${copiedCount}/${assetsToCopy.length} zasobów do dist/ (bezpieczne asynchroniczne postbuild).`);
