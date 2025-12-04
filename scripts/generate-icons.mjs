#!/usr/bin/env node
/**
 * Generate raster icon assets from the source SVG logo.
 * Requires: sharp
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SRC = join(process.cwd(), 'public', 'logo.svg');
const OUT = join(process.cwd(), 'public');

const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 300, 512, 1024];

async function run() {
  let svg;
  try {
    svg = await readFile(SRC);
  } catch (e) {
    console.error('Source SVG not found at', SRC);
    process.exit(1);
  }

  for (const size of sizes) {
    let fileName = size === 32 ? 'favicon.png' : `logo-${size}.png`;
    if (size === 300) fileName = 'icon-300.png';
    if (size === 180) fileName = 'apple-touch-icon.png';
    if (size === 192) fileName = 'android-chrome-192x192.png';
    if (size === 512) fileName = 'android-chrome-512x512.png';
    const dest = join(OUT, fileName);
    await sharp(svg)
      .resize(size, size, { fit: 'contain' })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log('Generated', dest);
  }

  // ICO (multi-size) generation using smallest relevant sizes
  const icoSizes = [16, 32, 48];
  const buffers = [];
  for (const size of icoSizes) {
    const buf = await sharp(svg).resize(size, size).png().toBuffer();
    buffers.push(buf);
  }
  // simple ICO builder
  const icoPath = join(OUT, 'favicon.ico');
  await buildIco(buffers, icoPath);
  console.log('Generated', icoPath);
}

async function buildIco(images, outPath) {
  // Minimal ICO writer (PNG entries)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(images.length, 4); // count

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const img of images) {
    const size = await sharp(img).metadata();
    const w = size.width || 0;
    const h = size.height || 0;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(w === 256 ? 0 : w, 0); // width (0 means 256)
    entry.writeUInt8(h === 256 ? 0 : h, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(img.length, 8); // size in bytes
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += img.length;
  }
  const file = Buffer.concat([header, ...entries, ...images]);
  await writeFile(outPath, file);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


