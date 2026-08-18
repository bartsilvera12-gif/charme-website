import Link from "next/link";
import NextImage from "next/image";
import { galleryItems } from "./data";

export const metadata = {
  title: "Galería — Academia CHARME",
  description:
    "Galería de trabajos, clases y momentos de Academia CHARME. Una muestra del trabajo profesional de nuestra academia.",
};

export default function GaleriaPage() {
  return (
    <main className="galeria-page">
      <header className="site-header nosotros-header">
        <Link href="/" className="brand" aria-label="Academia CHARME">
          <NextImage src="/images/logo.png" alt="Academia CHARME" width={200} height={110} unoptimized />
        </Link>
        <nav className="desktop-nav">
          <Link href="/#formaciones">Formaciones</Link>
          <Link href="/#academia">Academia</Link>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/#profesionales">Profesionales</Link>
          <Link href="/galeria" className="active">Galería</Link>
        </nav>
        <div className="header-actions">
          <Link className="button button-dark" href="/">Volver al inicio</Link>
        </div>
      </header>

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
                <video src={item.src} autoPlay muted loop playsInline preload="metadata" />
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
