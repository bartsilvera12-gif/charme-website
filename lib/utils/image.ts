const MAX_DIM = 1600;

/**
 * Comprime y redimensiona una imagen en el navegador, devolviendo un Blob WebP.
 * Reduce fotos pesadas (varios MB) a ~100-300 KB sin pérdida visible.
 */
export async function compressToWebp(file: File, maxDim = MAX_DIM, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no-canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("no-blob"))), "image/webp", quality),
  );
}
