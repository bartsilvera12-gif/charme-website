export type GalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
};

// Maqueta visual: imágenes en /public/images/galeria, videos en /public/videos/galeria.
// Más adelante estos datos vendrán del panel de administración (Vercel Blob).
export const galleryImages: GalleryItem[] = Array.from({ length: 48 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    type: "image" as const,
    src: `/images/galeria/galeria-${num}.webp`,
    alt: `Trabajo profesional de Academia CHARME ${i + 1}`,
  };
});

export const galleryVideos: GalleryItem[] = Array.from({ length: 6 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    type: "video" as const,
    src: `/videos/galeria/galeria-v${num}.mp4`,
    alt: `Video de Academia CHARME ${i + 1}`,
  };
});

// La galería completa (/galeria) muestra primero los videos y luego las imágenes.
export const galleryItems: GalleryItem[] = [...galleryVideos, ...galleryImages];
