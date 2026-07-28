import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public");
const entriesToPublish = [
  "index.html",
  "styles.css",
  "script.js",
  "assets",
  "candidate",
  "company",
  "consultancy",
];

rmSync(publicRoot, { recursive: true, force: true });
mkdirSync(publicRoot, { recursive: true });

for (const entry of entriesToPublish) {
  const sourcePath = path.join(projectRoot, entry);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing required publish source: ${entry}`);
  }

  cpSync(sourcePath, path.join(publicRoot, entry), {
    recursive: true,
  });
}

console.log(`Prepared Vercel static assets in ${publicRoot}`);
