// Copia la salida estática de Next (out/) a dist/ para subir a Hostinger.
import { rmSync, cpSync, existsSync } from "node:fs";

if (existsSync("dist")) rmSync("dist", { recursive: true, force: true });
cpSync("out", "dist", { recursive: true });
console.log("✓ Copiado out/ -> dist/  (subí el contenido de dist/ a public_html en Hostinger)");
