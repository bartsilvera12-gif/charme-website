"use client";

import NextImage from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { courses } from "./cursos/data";

function Image(props: ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

const testimonials = [
  { name: "Ana Giménez", username: "@ana.g", body: "Los cursos me cambiaron la forma de trabajar. Práctica pura y bien explicada.", img: "https://randomuser.me/api/portraits/women/32.jpg", country: "🇵🇾 Paraguay" },
  { name: "Sofía Ramírez", username: "@sofir", body: "Aprendí colorimetría desde cero y hoy vivo de esto. Gracias CHARME.", img: "https://randomuser.me/api/portraits/women/68.jpg", country: "🇦🇷 Argentina" },
  { name: "Mateo Rojas", username: "@mateor", body: "Las clases online son claras, con material que se puede ver una y otra vez.", img: "https://randomuser.me/api/portraits/men/51.jpg", country: "🇺🇾 Uruguay" },
  { name: "María Duarte", username: "@mari", body: "Me encantó la forma de enseñar. Muy profesional y humano a la vez.", img: "https://randomuser.me/api/portraits/women/53.jpg", country: "🇵🇾 Paraguay" },
  { name: "Nicolás Vera", username: "@nicov", body: "El master de colorimetría es lo mejor que hice en mi carrera.", img: "https://randomuser.me/api/portraits/men/33.jpg", country: "🇨🇱 Chile" },
  { name: "Lucas Benítez", username: "@lucasb", body: "Muy práctico y aplicable desde el primer día. 100% recomendado.", img: "https://randomuser.me/api/portraits/men/22.jpg", country: "🇧🇴 Bolivia" },
  { name: "Camila Torres", username: "@camit", body: "El área del alumno es cómoda y muy fácil de usar.", img: "https://randomuser.me/api/portraits/women/85.jpg", country: "🇵🇾 Paraguay" },
  { name: "Emma López", username: "@emma", body: "Contenido de altísima calidad. Se nota la experiencia detrás.", img: "https://randomuser.me/api/portraits/women/45.jpg", country: "🇵🇪 Perú" },
  { name: "Carlos Ríos", username: "@carlos", body: "Los tips de Mirta valen oro. Ya se ve el cambio en mi trabajo.", img: "https://randomuser.me/api/portraits/men/61.jpg", country: "🇪🇸 España" },
];

type Testimonial = (typeof testimonials)[number];

function TestimonialCard({ img, name, username, body, country }: Testimonial) {
  return (
    <figure className="testimonial-card">
      <div className="tc-head">
        <img src={img} alt={name} className="tc-avatar" />
        <figcaption>
          <span className="tc-name">{name} <em>{country}</em></span>
          <span className="tc-user">{username}</span>
        </figcaption>
      </div>
      <blockquote>{body}</blockquote>
    </figure>
  );
}

function MarqueeColumn({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`marquee-col ${reverse ? "reverse" : ""}`}>
      <div className="marquee-track">
        {[...testimonials, ...testimonials].map((t, i) => (
          <TestimonialCard key={`${t.username}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}

const faqs = [
  ["¿Cómo accedo a los cursos?", "Después de inscribirte, ingresás al área del alumno con tu correo y contraseña para acceder a tus formaciones."],
  ["¿Los cursos tienen certificado?", "La disponibilidad y las condiciones del certificado se indican en la ficha de cada formación antes de inscribirte."],
  ["¿Puedo estudiar desde mi celular?", "Sí. La plataforma está preparada para computadora, tablet y celular."],
  ["¿Por cuánto tiempo tengo acceso?", "El tiempo de acceso puede variar según la formación. Vas a encontrar ese dato dentro del detalle de cada curso."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [showAll]);

  const closeMenu = () => setMenuOpen(false);
  const openAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setLoginOpen(true);
  };
  const closeAuth = () => {
    setLoginOpen(false);
    setAuthMode("login");
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <Image src="/images/logo.png" alt="Academia CHARME" width={310} height={170} priority />
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#formaciones">Formaciones</a>
          <a href="#academia">Academia</a>
          <a href="/nosotros">Nosotros</a>
          <a href="#profesionales">Profesionales</a>
        </nav>
        <div className="header-actions">
          <button className="login-link" onClick={() => openAuth("login")}>Iniciar sesión</button>
          <a className="button button-dark" href="#formaciones">Explorar cursos</a>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">Menú</button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-top">
          <Image src="/images/logo.png" alt="Academia CHARME" width={260} height={140} />
          <button onClick={closeMenu} aria-label="Cerrar menú">×</button>
        </div>
        <nav>
          <a onClick={closeMenu} href="#formaciones">Formaciones</a>
          <a onClick={closeMenu} href="#academia">Academia</a>
          <a onClick={closeMenu} href="/nosotros">Nosotros</a>
          <a onClick={closeMenu} href="#profesionales">Profesionales</a>
          <button onClick={() => { closeMenu(); openAuth("login"); }}>Iniciar sesión</button>
        </nav>
      </div>

      <section id="inicio" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Academia digital CHARME</p>
          <h1>Aprendé de quienes viven la belleza.</h1>
          <span className="short-line" />
          <p>Formación profesional,<br />ahora desde cualquier lugar.</p>
          <a className="button button-dark" href="#formaciones">Explorar formaciones</a>
        </div>
        <div className="hero-image">
          <Image className="hero-slide" src="/images/hero.avif" alt="Trabajo profesional de coloración en Academia CHARME" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          <Image className="hero-slide" src="/images/masterclass.webp" alt="Masterclass en Academia CHARME" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <Image className="hero-slide" src="/images/editorial.webp" alt="Detalle editorial Academia CHARME" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
      </section>

      <section id="academia" className="editorial section-shell">
        <div className="editorial-copy reveal">
          <p className="eyebrow">Nuestra forma de enseñar</p>
          <h2>Experiencia<br />que se enseña.</h2>
          <span className="short-line" />
          <p>En Academia CHARME transformamos años de experiencia en formación real y aplicable. Enseñamos con excelencia para que desarrolles tu talento, eleves tu técnica y construyas tu propio camino en la belleza.</p>
          <a className="text-link" href="#profesionales">Conocer la academia <span>→</span></a>
        </div>
        <div className="editorial-image reveal">
          <Image src="/images/barba.png" alt="Proceso de coloración profesional" fill sizes="(max-width: 800px) 100vw, 56vw" />
        </div>
      </section>

      <section id="formaciones" className="courses-section section-shell">
        <div className="section-heading reveal">
          <p className="eyebrow">Formaciones CHARME</p>
          <h2>Perfeccioná tu técnica.</h2>
          <p>Elegí la formación que acompaña tu próximo nivel profesional.</p>
        </div>
        <div className="course-grid">
          {courses.slice(0, showAll ? courses.length : 4).map((course) => (
            <Link className="course-card reveal" key={course.slug} href={`/cursos/${course.slug}`}>
              <div className="course-image">
                <Image src={course.image} alt={course.name} fill sizes="(max-width: 640px) 82vw, (max-width: 1000px) 42vw, 22vw" />
              </div>
              <div className="course-meta">
                <div><h3>{course.name}</h3><p>{course.price}</p></div>
                <span aria-hidden="true" className="cc-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
        {!showAll && <button className="button button-outline view-all" onClick={() => setShowAll(true)}>Ver todas las formaciones</button>}
        <p className="payment-note">Precios expresados para pagos en efectivo. Débito: recargo del 5%. Crédito: recargo del 10%.</p>
      </section>

      <section className="masterclass">
        <Image src="/images/masterclass.webp" alt="Masterclass CHARME" fill sizes="100vw" />
        <div className="masterclass-overlay" />
        <div className="masterclass-copy reveal">
          <p className="eyebrow">CHARME Masterclass</p>
          <h2>Llevá tu técnica<br />al próximo nivel.</h2>
          <a className="button button-light" href="#formaciones">Descubrir masterclass</a>
        </div>
      </section>

     <section id="profesionales" className="professional section-shell">
  <div className="professional-visual reveal">
    <span className="professional-frame" aria-hidden="true" />

    <div className="portrait">
      <Image
        src="/images/mirta.webp"
        alt="Mirta Mena"
        fill
        sizes="(max-width: 800px) 100vw, 42vw"
      />
    </div>
  </div>

  <div className="professional-copy reveal">


    <p className="eyebrow">Profesionales CHARME</p>

    <h2>
      Experiencia real,
      <br />
      conocimiento que
      <br />
      se comparte.
    </h2>

    <div className="professional-identity">
      <p className="eyebrow">Master artist</p>
      <h3>Mirta Mena</h3>

      <span className="professional-rule" aria-hidden="true" />

      <p className="professional-description">
        Una propuesta de formación nacida del oficio, la práctica y la
        búsqueda constante de excelencia.
      </p>

      <Link
        href="/nosotros"
        className="button button-outline professional-cta"
      >
        Conocer su trayectoria
      </Link>
    </div>
  </div>
</section>

      <section className="online">
        <div className="online-copy reveal">
          <p className="eyebrow">Experiencia online</p>
          <h2>Tu formación continúa donde estés.</h2>
          <span className="short-line" />
          <p>Una experiencia online diseñada para acompañarte en cada paso. Accedé a tus cursos, seguí tu progreso y organizá tu aprendizaje con todo en un solo lugar.</p>
          <button className="text-link" onClick={() => openAuth("login")}>Conocer el área del alumno <span>→</span></button>
        </div>
        <div className="online-image">
          <Image src="/images/experiencia-online.png" alt="Área del alumno de Academia CHARME" fill sizes="(max-width: 900px) 100vw, 55vw" />
        </div>
      </section>

      <section className="faq section-shell">
        <div className="section-heading reveal"><p className="eyebrow">Antes de comenzar</p><h2>Preguntas frecuentes</h2></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={question}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                <span>{question}</span><b>+</b>
              </button>
              <div><p>{answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials section-shell">
        <div className="section-heading reveal">
          <p className="eyebrow">Lo que dicen las alumnas</p>
          <h2>Historias que hablan<br />por sí solas.</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.slice(0, 6).map((t) => (
            <figure key={t.username} className="testimonial-pull reveal">
              <span className="tp-quote" aria-hidden="true">“</span>
              <blockquote>{t.body}</blockquote>
              <figcaption>
                <img src={t.img} alt={t.name} className="tp-avatar" />
                <div>
                  <span className="tp-name">{t.name}</span>
                  <span className="tp-meta">{t.country} · Alumna CHARME</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <Image src="/images/final-cta.webp" alt="Academia CHARME" fill sizes="100vw" />
        <div className="final-overlay" />
        <div className="reveal"><p className="eyebrow">Academia CHARME</p><h2>Tu próximo nivel<br />empieza acá.</h2><a className="button button-light" href="#formaciones">Explorar formaciones</a></div>
      </section>




      <footer>
        <div className="footer-grid section-shell">
          <Image className="footer-logo" src="/images/logo.png" alt="Academia CHARME" width={310} height={170} />
          <div><h3>Academia</h3><a href="#academia">Sobre nosotros</a><a href="#profesionales">Profesionales</a></div>
          <div><h3>Formaciones</h3><a href="#formaciones">Todos los cursos</a><button onClick={() => openAuth("login")}>Área del alumno</button></div>
          <div><h3>Contacto</h3><a href="https://wa.me/595986373130" target="_blank" rel="noreferrer">WhatsApp</a><span>Paraguay</span></div>
          <div><h3>Legal</h3><a href="/politica-de-privacidad">Política de privacidad</a></div>
        </div>
        <div className="copyright">
          <span>© Academia CHARME. Todos los derechos reservados.</span>
          <span className="dev-credit">Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noreferrer">Neura</a></span>
        </div>
      </footer>

      {loginOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={authMode === "login" ? "Iniciar sesión" : "Crear cuenta"} onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}>
          <div className="login-modal">
            <button className="modal-close" onClick={closeAuth} aria-label="Cerrar">×</button>
            <Image src="/images/logo.png" alt="Academia CHARME" width={240} height={130} />
            <p className="eyebrow">{authMode === "login" ? "Área del alumno" : "Nueva alumna/o"}</p>
            <h2>{authMode === "login" ? "Continuá aprendiendo." : "Empezá tu formación."}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              {authMode === "register" && <label>Nombre completo<input type="text" placeholder="Tu nombre y apellido" autoComplete="name" required /></label>}
              <label>Email<input type="email" placeholder="tu@email.com" autoComplete="email" required /></label>
              <label>Contraseña<input type="password" placeholder="••••••••" autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={8} required /></label>
              {authMode === "register" && <label>Confirmar contraseña<input type="password" placeholder="••••••••" autoComplete="new-password" minLength={8} required /></label>}
              <button className="button button-dark" type="submit">{authMode === "login" ? "Iniciar sesión" : "Crear mi cuenta"}</button>
            </form>
            <div className="auth-switch">
              <span>{authMode === "login" ? "¿Todavía no tenés cuenta?" : "¿Ya tenés una cuenta?"}</span>
              <button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
                {authMode === "login" ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </div>
            <small>Vista demostrativa. La autenticación debe conectarse con Supabase Auth para habilitar el acceso real.</small>
          </div>
        </div>
      )}
    </main>
  );
}
