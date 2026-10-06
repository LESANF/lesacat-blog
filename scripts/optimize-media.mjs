import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const images = await readdir("public/images", { recursive: true });
let originalBytes = 0;
let servedBytes = 0;

for (const file of images.filter((file) => file.endsWith(".gif"))) {
  const source = path.join("public/images", file);
  const destination = source.replace(/\.gif$/, ".webp");
  const original = await sharp(source).metadata();
  await sharp(source, { animated: true })
    .webp({ quality: 75, effort: 2, mixed: true })
    .toFile(destination);
  const compressed = await sharp(destination).metadata();
  // GIF delays of 0–10 ms play at 100 ms in browsers; identical frames may merge.
  const duration = (metadata) => metadata.delay
    .map((delay) => delay <= 10 ? 100 : delay)
    .reduce((total, delay) => total + delay, 0);
  if (
    original.width !== compressed.width || original.height !== compressed.height ||
    original.loop !== compressed.loop || duration(original) !== duration(compressed) ||
    compressed.pages < 2
  ) {
    await unlink(destination);
    throw new Error(`Animation changed during conversion: ${file}`);
  }
  const before = (await stat(source)).size;
  const after = (await stat(destination)).size;
  if (after >= before) await unlink(destination);
  originalBytes += before;
  servedBytes += Math.min(before, after);
  console.log(`${file}: ${before} -> ${Math.min(before, after)} bytes`);
}

console.log(`Total: ${originalBytes} -> ${servedBytes} bytes`);
