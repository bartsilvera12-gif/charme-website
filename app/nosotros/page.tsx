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

      <section className="nosotros-contact section-shell">
        <div className="contact-intro">
          <p className="eyebrow">Contacto</p>
          <h2>Encontranos.</h2>
          <p className="contact-lead">Estamos para acompañarte en cada paso de tu formación. Escribinos, visitanos o mandanos un mensaje — te respondemos.</p>
        </div>
        <div className="contact-grid">
          <a className="contact-card" href="https://maps.google.com/?q=Avda.+Gaspar+Rodriguez+de+Francia+c/+Defensores+del+Chaco+San+Lorenzo+Paraguay" target="_blank" rel="noreferrer">
            <span className="cc-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <p className="eyebrow">Dirección</p>
            <h3>Visitanos en San Lorenzo</h3>
            <p>Avda. Gaspar Rodríguez de Francia c/ Defensores del Chaco.</p>
            <span className="cc-link">Cómo llegar <em>→</em></span>
          </a>
          <a className="contact-card featured" href="https://wa.me/595986373130" target="_blank" rel="noreferrer">
            <span className="cc-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 12a8.5 8.5 0 1 1-15.6-4.7L3.5 20l4.7-1.4A8.5 8.5 0 0 0 20.5 12Z"/><path d="M8.5 9.5c0 4 2 6 6 6l1.5-1.5-2-1.5-1 1c-1.5-.5-2.5-1.5-3-3l1-1-1.5-2Z"/></svg>
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
        </div>
        <div className="copyright">© Academia CHARME. Todos los derechos reservados.</div>
      </footer>
    </main>
  );
}
