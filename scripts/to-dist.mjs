// Copia la salida estática de Next (out/) a dist/ para subir a Hostinger.
// En Vercel NO se ejecuta (Vercel sirve la exportación directamente).
import { rmSync, cpSync, existsSync } from "node:fs";

if (process.env.VERCEL) {
  console.log("Entorno Vercel detectado: se omite la copia a dist/.");
  process.exit(0);
}

if (existsSync("dist")) rmSync("dist", { recursive: true, force: true });
cpSync("out", "dist", { recursive: true });
console.log("✓ Copiado out/ -> dist/  (subí el contenido de dist/ a public_html en Hostinger)");
