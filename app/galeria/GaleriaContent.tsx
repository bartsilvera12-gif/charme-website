"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { getGalleryItems, type GalleryView } from "@/lib/data/site";
import PublicHeader from "@/components/public/PublicHeader";

export default function GaleriaContent() {
  const [galleryItems, setGalleryItems] = useState<GalleryView[]>([]);

  useEffect(() => {
    let active = true;
    getGalleryItems().then((items) => { if (active) setGalleryItems(items); }).catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <main className="galeria-page">
      <PublicHeader active="galeria" />

      <section className="galeria-hero section-shell">
        <p className="eyebrow">Galería CHARME</p>
        <h1>Nuestro trabajo en imágenes.</h1>
        <span className="short-line" />
        <p className="lead">Una muestra de trabajos, clases y momentos de la academia.</p>
      </section>

      <section className="galeria-full section-shell">
        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <figure key={`${item.src}-${i}`} className="gallery-item">
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.src.replace(/\.mp4$/i, ".jpg")}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <NextImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1050px) 33vw, 25vw"
                  unoptimized
                />
              )}
            </figure>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-grid section-shell">
          <NextImage className="footer-logo" src="/images/logo.png" alt="Academia CHARME" width={310} height={170} unoptimized />
          <div><h3>Academia</h3><Link href="/#academia">Sobre nosotros</Link><Link href="/#profesionales">Profesionales</Link></div>
          <div><h3>Formaciones</h3><Link href="/#formaciones">Todos los cursos</Link></div>
          <div><h3>Contacto</h3><a href="https://wa.me/595986373130" target="_blank" rel="noreferrer">WhatsApp</a><span>Paraguay</span></div>
          <div><h3>Legal</h3><Link href="/politica-de-privacidad">Política de privacidad</Link></div>
        </div>
        <div className="copyright">
          <span>© Academia CHARME. Todos los derechos reservados.</span>
          <span className="dev-credit">Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noreferrer">Neura</a></span>
        </div>
      </footer>
    </main>
  );
}
