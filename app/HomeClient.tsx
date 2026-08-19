"use client";

import NextImage from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import type { CourseListItem } from "@/lib/data/courses";
import { getActiveCourses } from "@/lib/data/courses";
import type { GalleryView, TestimonialView, FaqView, HomeSection, ProfessionalView } from "@/lib/data/site";
import { getTestimonials, getFaqs, getGalleryItems, getGalleryCount, getHomeContent, getFeaturedProfessional } from "@/lib/data/site";

function Image(props: ComponentProps<typeof NextImage>) {
  return <NextImage {...props} unoptimized />;
}

// Cantidad visible en la home (2 filas de 4 = 8). El resto se ve en /galeria.
const GALLERY_PREVIEW_COUNT = 8;

export default function Home() {
  // Datos en vivo desde Supabase (se actualizan cuando cambian en el panel).
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialView[]>([]);
  const [faqs, setFaqs] = useState<FaqView[]>([]);
  const [gallery, setGallery] = useState<GalleryView[]>([]);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [home, setHome] = useState<Record<string, HomeSection>>({});
  const [professional, setProfessional] = useState<ProfessionalView | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      getActiveCourses().catch(() => []),
      getTestimonials().catch(() => []),
      getFaqs().catch(() => []),
      getGalleryItems(3, "video").catch(() => []),
      getGalleryItems(5, "image").catch(() => []),
      getGalleryCount().catch(() => 0),
      getHomeContent().catch(() => ({})),
      getFeaturedProfessional().catch(() => null),
    ]).then(([c, t, f, vids, imgs, gt, h, p]) => {
      if (!active) return;
      setCourses(c as CourseListItem[]);
      setTestimonials(t as TestimonialView[]);
      setFaqs(f as FaqView[]);
      setGallery([...(vids as GalleryView[]), ...(imgs as GalleryView[])]);
      setGalleryTotal(gt as number);
      setHome(h as Record<string, HomeSection>);
      setProfessional(p as ProfessionalView | null);
      setDataLoaded(true);
    });
    return () => { active = false; };
  }, []);

  // Helper para leer una sección del home con fallback al texto original.
  const hc = (section: string, field: keyof HomeSection, fallback: string): string => {
    const v = home?.[section]?.[field];
    return (typeof v === "string" && v.trim()) ? v : fallback;
  };
  const hcImg = (section: string, fallback: string): string =>
    home?.[section]?.image_url || fallback;
  const heroExtra = home?.hero?.extra ?? {};
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
  }, [showAll, dataLoaded]);

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
          <a href="/galeria">Galería</a>
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
          <a onClick={closeMenu} href="/galeria">Galería</a>
          <button onClick={() => { closeMenu(); openAuth("login"); }}>Iniciar sesión</button>
        </nav>
      </div>

      <section id="inicio" className="hero">
        <div className="hero-badge" aria-hidden="true">
          <span>{(heroExtra.badge_left as string) || "Est. Paraguay"}</span>
          <span className="hb-dot">·</span>
          <span>{(heroExtra.badge_right as string) || "+30 años de excelencia"}</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">{hc("hero", "eyebrow", "Academia digital CHARME")}</p>
          <h1>{hc("hero", "title", "Aprendé de quienes viven la belleza.")}</h1>
          <span className="short-line" />
          <p>{hc("hero", "subtitle", "Formación profesional, ahora desde cualquier lugar.")}</p>
          <a className="button button-dark" href={hc("hero", "cta_url", "#formaciones")}>{hc("hero", "cta_label", "Explorar formaciones")}</a>
        </div>
        <a className="hero-scroll" href="#academia" aria-label="Descubrí más">
          <span>Descubrí</span>
          <span className="hs-line" />
        </a>
        <div className="hero-image">
          <Image className="hero-slide" src={hcImg("hero", "/images/hero.avif")} alt="Trabajo profesional de Academia CHARME" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          <Image className="hero-slide" src={(heroExtra.image_secondary as string) || "/images/editorial.webp"} alt="Detalle editorial Academia CHARME" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
      </section>

      <section id="academia" className="editorial section-shell">
        <div className="editorial-copy reveal">
          <p className="eyebrow">{hc("academia", "eyebrow", "Nuestra forma de enseñar")}</p>
          <h2>{hc("academia", "title", "Experiencia que se enseña.")}</h2>
          <span className="short-line" />
          <p>{hc("academia", "body", "En Academia CHARME transformamos años de experiencia en formación real y aplicable. Enseñamos con excelencia para que desarrolles tu talento, eleves tu técnica y construyas tu propio camino en la belleza.")}</p>
          <a className="text-link" href={hc("academia", "cta_url", "#profesionales")}>{hc("academia", "cta_label", "Conocer la academia")} <span>→</span></a>
        </div>
        <div className="editorial-image reveal">
          <Image src={hcImg("academia", "/images/galeria/galeria-26.webp")} alt="Academia CHARME" fill sizes="(max-width: 800px) 100vw, 56vw" style={{ objectPosition: "35% center" }} />
        </div>
      </section>

      <section id="formaciones" className="courses-section section-shell">
        <div className="section-heading reveal">
          <p className="eyebrow">{hc("formaciones", "eyebrow", "Formaciones CHARME")}</p>
          <h2>{hc("formaciones", "title", "Perfeccioná tu técnica.")}</h2>
          <p>{hc("formaciones", "body", "Elegí la formación que acompaña tu próximo nivel profesional.")}</p>
        </div>
        <div className="course-grid">
          {courses.slice(0, showAll ? courses.length : (Number(home?.formaciones?.extra?.initial_count) || 4)).map((course) => (
            <Link className="course-card reveal" key={course.slug} href={`/cursos/${course.slug}`}>
              <div className="course-image">
                <Image src={course.image || "/images/logo.png"} alt={course.name} fill sizes="(max-width: 640px) 82vw, (max-width: 1000px) 42vw, 22vw" />
              </div>
              <div className="course-meta">
                <div><h3>{course.name}</h3><p>{course.price}</p></div>
                <span aria-hidden="true" className="cc-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
        {!showAll && <button className="button button-outline view-all" onClick={() => setShowAll(true)}>Ver todas las formaciones</button>}
        <p className="payment-note">{(home?.formaciones?.extra?.payment_terms as string) || "Precios expresados para pagos en efectivo. Débito: recargo del 5%. Crédito: recargo del 10%."}</p>
      </section>

      <section className="masterclass">
        <Image src={hcImg("masterclass", "/images/masterclass.webp")} alt="Masterclass CHARME" fill sizes="100vw" />
        <div className="masterclass-overlay" />
        <div className="masterclass-copy reveal">
          <p className="eyebrow">{hc("masterclass", "eyebrow", "CHARME Masterclass")}</p>
          <h2>{hc("masterclass", "title", "Llevá tu técnica al próximo nivel.")}</h2>
          <a className="button button-light" href={hc("masterclass", "cta_url", "#formaciones")}>{hc("masterclass", "cta_label", "Descubrir masterclass")}</a>
        </div>
      </section>

     <section id="profesionales" className="professional section-shell">
  <div className="professional-visual reveal">
    <span className="professional-frame" aria-hidden="true" />

    <div className="portrait">
      <Image
        src={professional?.image || "/images/mirta.webp"}
        alt={professional?.name || "Mirta Mena"}
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
      <p className="eyebrow">{professional?.roleTitle || "Master artist"}</p>
      <h3>{professional?.name || "Mirta Mena"}</h3>

      <span className="professional-rule" aria-hidden="true" />

      <p className="professional-description">
        {professional?.shortDescription ||
          "Una propuesta de formación nacida del oficio, la práctica y la búsqueda constante de excelencia."}
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

      <section id="galeria" className="gallery-section section-shell">
        <div className="section-heading reveal">
          <p className="eyebrow">Galería CHARME</p>
          <h2>Nuestro trabajo<br />en imágenes.</h2>
          <p>Una muestra de trabajos, clases y momentos de la academia.</p>
        </div>
        <div className="gallery-grid">
          {gallery.slice(0, GALLERY_PREVIEW_COUNT).map((item, i) => (
            <figure key={`${item.src}-${i}`} className="gallery-item reveal">
              {item.type === "video" ? (
                <video src={item.src} poster={item.src.replace(/\.mp4$/i, ".jpg")} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 50vw, (max-width: 1050px) 33vw, 25vw" />
              )}
            </figure>
          ))}
        </div>
        {galleryTotal > GALLERY_PREVIEW_COUNT && (
          <div className="gallery-more reveal">
            <Link className="button button-dark" href="/galeria">Ver todo</Link>
          </div>
        )}
      </section>

      <section className="online">
        <div className="online-copy reveal">
          <p className="eyebrow">{hc("online", "eyebrow", "Experiencia online")}</p>
          <h2>{hc("online", "title", "Tu formación continúa donde estés.")}</h2>
          <span className="short-line" />
          <p>{hc("online", "body", "Una experiencia online diseñada para acompañarte en cada paso. Accedé a tus cursos, seguí tu progreso y organizá tu aprendizaje con todo en un solo lugar.")}</p>
          <button className="text-link" onClick={() => openAuth("login")}>{hc("online", "cta_label", "Conocer el área del alumno")} <span>→</span></button>
        </div>
        <div className="online-image">
          <Image src={hcImg("online", "/images/experiencia-online.png")} alt="Área del alumno de Academia CHARME" fill sizes="(max-width: 900px) 100vw, 55vw" />
        </div>
      </section>

      <section className="faq section-shell">
        <div className="section-heading reveal"><p className="eyebrow">Antes de comenzar</p><h2>Preguntas frecuentes</h2></div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={faq.question}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                <span>{faq.question}</span><b>+</b>
              </button>
              <div><p>{faq.answer}</p></div>
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
                <img src={t.img ?? undefined} alt={t.name} className="tp-avatar" />
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
        <Image src={hcImg("final_cta", "/images/final-cta.webp")} alt="Academia CHARME" fill sizes="100vw" />
        <div className="final-overlay" />
        <div className="reveal"><p className="eyebrow">{hc("final_cta", "eyebrow", "Academia CHARME")}</p><h2>{hc("final_cta", "title", "Tu próximo nivel empieza acá.")}</h2><a className="button button-light" href={hc("final_cta", "cta_url", "#formaciones")}>{hc("final_cta", "cta_label", "Explorar formaciones")}</a></div>
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
