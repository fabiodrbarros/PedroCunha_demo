// Generate favicons, apple-touch-icon and social images from /logo.png.
// Run: node scripts/generate-assets.mjs
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "logo.png");
const PUB = path.join(ROOT, "public");
const APP = path.join(ROOT, "src", "app");

const PAPER = { r: 246, g: 244, b: 239, alpha: 1 }; // #F6F4EF
const INK = "#1B1B1B";

async function main() {
  await fs.mkdir(PUB, { recursive: true });

  // 1. Isolate the P/C mark: crop the upper-centre of the lockup, then trim.
  const meta = await sharp(SRC).metadata(); // 1536 x 1024
  // extract and trim in separate passes (chaining both confuses sharp's
  // pipeline ordering and throws "bad extract area").
  const markCrop = await sharp(SRC)
    .extract({
      left: Math.round(meta.width * 0.34),
      top: Math.round(meta.height * 0.14),
      width: Math.round(meta.width * 0.32),
      height: Math.round(meta.height * 0.36),
    })
    .toBuffer();
  const markBuf = await sharp(markCrop).trim().toBuffer();

  // Expose the real monogram (transparent) for reuse across the UI.
  await sharp(markBuf).png().toFile(path.join(PUB, "monogram.png"));
  const markB64 = markBuf.toString("base64");

  // Square icon factory: mark centred on warm paper with breathing room.
  async function squareIcon(size, pad = 0.22) {
    const inner = Math.round(size * (1 - pad * 2));
    const mark = await sharp(markBuf)
      .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    return sharp({
      create: { width: size, height: size, channels: 4, background: PAPER },
    })
      .composite([{ input: mark, gravity: "center" }])
      .png();
  }

  // 2. PNG icons
  const icons = [
    ["favicon-16.png", 16],
    ["favicon-32.png", 32],
    ["favicon-48.png", 48],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
    ["apple-touch-icon.png", 180],
  ];
  for (const [name, size] of icons) {
    await (await squareIcon(size, name.startsWith("apple") ? 0.16 : 0.18)).toFile(
      path.join(PUB, name)
    );
  }

  // 3. favicon.ico (multi-size)
  const ico32 = await (await squareIcon(32, 0.16)).resize(32, 32).toBuffer();
  // sharp can't write .ico; write a 32px png named favicon.ico is not valid.
  // Provide a real .ico via png2icons-free approach: store 48px PNG bytes in ICO container.
  await writeIco(path.join(PUB, "favicon.ico"), [
    await (await squareIcon(16, 0.14)).resize(16, 16).toBuffer(),
    await (await squareIcon(32, 0.16)).resize(32, 32).toBuffer(),
    await (await squareIcon(48, 0.16)).resize(48, 48).toBuffer(),
  ]);

  // 4. favicon.svg — embeds the REAL monogram from the logo (never redrawn)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#F6F4EF"/>
  <image href="data:image/png;base64,${markB64}" x="14" y="13.5" width="36" height="37"/>
</svg>`;
  await fs.writeFile(path.join(PUB, "favicon.svg"), svg, "utf8");
  // Next.js app-router icon (also expose in /app for metadata convention)
  await fs.writeFile(path.join(APP, "icon.svg"), svg, "utf8");

  // 5. Open Graph / social sharing image (1200 x 630) — full lockup on paper.
  const ogW = 1200;
  const ogH = 630;
  const lock = await sharp(SRC)
    .trim({ threshold: 20 })
    .resize(560, 420, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const ogSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="${ogH}">
      <rect width="${ogW}" height="${ogH}" fill="#F6F4EF"/>
      <g fill="none" stroke="#E0DACE" stroke-width="1">
        ${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 90}" y1="0" x2="${i * 90}" y2="${ogH}"/>`).join("")}
        ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 90}" x2="${ogW}" y2="${i * 90}"/>`).join("")}
      </g>
    </svg>`
  );

  // small corner mark = the real monogram from the logo
  const cornerMark = await sharp(markBuf)
    .resize({ height: 120, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: ogW, height: ogH, channels: 4, background: PAPER },
  })
    .composite([
      { input: ogSvg, top: 0, left: 0 },
      { input: lock, gravity: "center", top: 105, left: 320 },
      { input: cornerMark, top: 470, left: 56 },
    ])
    .png()
    .toFile(path.join(PUB, "og-image.png"));

  // Social sharing variant (square-ish 1200x1200 for some platforms)
  await sharp({
    create: { width: 1200, height: 1200, channels: 4, background: PAPER },
  })
    .composite([{ input: await sharp(SRC).trim({ threshold: 20 }).resize(720, 540, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: "center" }])
    .png()
    .toFile(path.join(PUB, "social-share.png"));

  console.log("✓ Generated favicons, apple-touch-icon, OG and social images.");
}

// Minimal ICO writer: packs PNG buffers into an .ico container.
async function writeIco(outPath, pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  const images = [];
  let offset = 6 + count * 16;
  const sizes = [16, 32, 48];
  for (let i = 0; i < count; i++) {
    const buf = pngBuffers[i];
    const size = sizes[i] ?? 32;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    images.push(buf);
    offset += buf.length;
  }
  await fs.writeFile(outPath, Buffer.concat([header, ...entries, ...images]));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
