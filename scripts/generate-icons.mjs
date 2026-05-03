import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(resolve(__dirname, '../src/app/icon.svg'));

await sharp(svg).resize(192, 192).toFile(resolve(__dirname, '../public/icon-192.png'));
await sharp(svg).resize(512, 512).toFile(resolve(__dirname, '../public/icon-512.png'));

console.log('Icons generated: public/icon-192.png, public/icon-512.png');
