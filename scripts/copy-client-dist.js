import fs from "node:fs";
import path from "node:path";

/**
 * Ensures `dist/client` exists and contains all static assets.
 * Netlify's UI or older presets often look for `dist/client`,
 * while Nitro generates assets into `dist/`.
 * This guarantees zero deploy errors regardless of Netlify config.
 */
const distDir = path.resolve("dist");
const clientDir = path.resolve("dist", "client");

if (fs.existsSync(distDir)) {
  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
  }

  for (const item of fs.readdirSync(distDir)) {
    if (item === "client") continue;
    const src = path.join(distDir, item);
    const dest = path.join(clientDir, item);
    fs.cpSync(src, dest, { recursive: true, force: true });
  }

  console.log("✓ Mirrored static assets from dist/ to dist/client/ for Netlify compatibility.");
}
