import Link from "next/link";
import NextImage from "next/image";

export const metadata = {
  title: "Nosotros — Academia CHARME",
  description:
    "Nacida del fruto de más de 30 años de experiencia de la Sra. Mirta Mena, Academia CHARME forma profesionales en el ámbito de la belleza integral.",
};

export default function NosotrosPage() {
  return (
    <main className="nosotros">
      <header className="site-header nosotros-header">
        <Link href="/" className="brand" aria-label="Academia CHARME">
          <NextImage src="/images/logo.png" alt="Academia CHARME" width={200} height={110} unoptimized />
        </Link>
        <nav className="desktop-nav">
          <Link href="/#formaciones">Formaciones</Link>
          <Link href="/#academia">Academia</Link>
          <Link href="/nosotros" className="active">Nosotros</Link>
          <Link href="/#profesionales">Profesionales</Link>
        </nav>
        <div className="header-actions">
          <Link className="button button-dark" href="/">Volver al inicio</Link>
        </div>
      </header>

      <section className="nosotros-hero section-shell">
        <div className="nosotros-hero-copy">
          <p className="eyebrow">Academia CHARME</p>
          <h1>Nosotros</h1>
          <span className="short-line" />
          <p className="lead">
            Nacida del fruto de más de 30 años de experiencia de su Directora, la Sra. Mirta Mena.
            Academia CHARME es una institución creada para brindar una educación de calidad y
            excelencia a las personas que deseen comenzar a capacitarse como profesional en el
            ámbito de la Belleza Integral. En alianza con la Academia número 1 del mundo en color,
            la HSB, impartimos clases con profesionales de primer nivel.
          </p>
        </div>
        <div className="nosotros-hero-image">
          <NextImage src="/images/nosotros-hero.webp" alt="Academia CHARME" fill sizes="(max-width: 900px) 100vw, 50vw" priority unoptimized />
        </div>
      </section>

      <section className="nosotros-grid section-shell">
        <article className="nosotros-card">
          <p className="eyebrow">Visión</p>
          <h3>Formar líderes de la belleza integral.</h3>
          <span className="nc-divider" />
          <p>
            Ser la institución líder a nivel nacional de alto adiestramiento profesional por la
            formación completa de sus profesionales en todas las áreas de la belleza y estética
            integral.
          </p>
        </article>
        <article className="nosotros-card featured">
          <p className="eyebrow">Misión</p>
          <h3>Enseñar con excelencia,<br/>acompañar con propósito.</h3>
          <span className="nc-divider" />
          <p>
            Proveer al estudiante de Academia CHARME la experiencia más completa, moderna y de
            excelencia en el aprendizaje, usando metodologías innovadoras a nivel mundial con
            educadores altamente preparados, fomentando la cultura del estudio constante.
          </p>
        </article>
        <article className="nosotros-card">
          <p className="eyebrow">Valores</p>
          <h3>Los principios que nos guían.</h3>
          <span className="nc-divider" />
          <ul className="nc-values">
            <li>Excelencia</li>
            <li>Compromiso</li>
            <li>Integridad</li>
            <li>Fe y Salvación</li>
            <li>Perseverancia</li>
            <li>Sacrificio</li>
            <li>Pasión</li>
          </ul>
        </article>
      </section>

      <section className="nosotros-quote section-shell">
        <blockquote>
          <p>
            “La meta de la educación es el avance en el conocimiento y en la diseminación de la
            verdad.”
          </p>
          <cite>— Dir. Gral. Mirta Mena</cite>
        </blockquote>
      </section>

      <section className="nosotros-map section-shell">
        <div className="map-copy">
          <p className="eyebrow">Ubicación</p>
          <h2>Visitanos en San Lorenzo.</h2>
          <span className="short-line" />
          <p>
            Nuestra sede está sobre Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco.
            Fácil acceso desde el centro de Asunción y todo el área metropolitana.
          </p>
          <ul className="map-details">
            <li>
              <span className="md-label">Dirección</span>
              <span>Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco — San Lorenzo</span>
            </li>
            <li>
              <span className="md-label">Horario</span>
              <span>Lunes a viernes, 08:00 a 18:00 hs</span>
            </li>
            <li>
              <span className="md-label">Teléfono</span>
              <span><a href="https://wa.me/595986373130" target="_blank" rel="noreferrer">+595 (986) 373 130</a></span>
            </li>
          </ul>
          <a className="button button-dark map-cta" href="https://www.google.com.py/maps/place/CHARME+SAN+LORENZO/@-25.3417691,-57.5077899,17z" target="_blank" rel="noreferrer">Cómo llegar →</a>
        </div>
        <div className="map-embed">
          <iframe
            title="Ubicación de Academia CHARME en San Lorenzo"
            src="https://www.google.com/maps?q=CHARME+SAN+LORENZO,-25.3417691,-57.5077899&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      <section className="nosotros-contact section-shell">
        <div className="contact-intro">
          <p className="eyebrow">Contacto</p>
          <h2>Encontranos.</h2>
          <p className="contact-lead">Estamos para acompañarte en cada paso de tu formación. Escribinos, visitanos o mandanos un mensaje — te respondemos.</p>
        </div>
        <div className="contact-grid">
          <a className="contact-card featured" href="https://wa.me/595986373130" target="_blank" rel="noreferrer">
            <span className="cc-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </span>
            <p className="eyebrow">WhatsApp</p>
            <h3>Escribinos ahora</h3>
            <p>+595 (986) 373 130 — respondemos en horario comercial.</p>
            <span className="cc-link">Abrir chat <em>→</em></span>
          </a>
          <a className="contact-card" href="mailto:academiacharmeparaguay@gmail.com">
            <span className="cc-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            </span>
            <p className="eyebrow">Email</p>
            <h3>Consultas por correo</h3>
            <p>academiacharmeparaguay@gmail.com</p>
            <span className="cc-link">Enviar mail <em>→</em></span>
          </a>
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
