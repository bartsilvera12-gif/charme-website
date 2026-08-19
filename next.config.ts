import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático (genera la carpeta `out/` para subir a Hostinger compartido).
  output: "export",
  // En export no hay optimización de imágenes en servidor: se sirven tal cual.
  images: { unoptimized: true },
  // Cada ruta genera carpeta/index.html → Apache/Hostinger la sirve sin config extra.
  trailingSlash: true,
  // Oculta el indicador flotante de Next.js en desarrollo.
  devIndicators: false,
};

export default nextConfig;
