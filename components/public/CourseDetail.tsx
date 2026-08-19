"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { getCourseBySlug, getRelatedCourses, type CourseDetail as Course, type CourseListItem } from "@/lib/data/courses";
import PublicHeader from "@/components/public/PublicHeader";

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <main className="course-page">
      <PublicHeader />
      {children}
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

export default function CourseDetail({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [related, setRelated] = useState<CourseListItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    getCourseBySlug(slug).then(async (c) => {
      if (!active) return;
      if (!c) { setState("missing"); return; }
      setCourse(c);
      setState("ready");
      const rel = await getRelatedCourses(c.categorySlug, slug).catch(() => []);
      if (active) setRelated(rel);
    }).catch(() => { if (active) setState("missing"); });
    return () => { active = false; };
  }, [slug]);

  if (state === "loading") {
    return <Chrome><section className="section-shell" style={{ padding: "80px 0", textAlign: "center", color: "var(--muted)" }}>Cargando…</section></Chrome>;
  }
  if (state === "missing" || !course) {
    return (
      <Chrome>
        <section className="section-shell" style={{ padding: "100px 0", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--serif)", marginBottom: 16 }}>Formación no encontrada</h1>
          <Link className="button button-dark" href="/#formaciones">Ver todas las formaciones</Link>
        </section>
      </Chrome>
    );
  }

  const pagoparUrl = course.pagoparUrl || course.altEnrollUrl || "#";
  const courseImage = course.image || "/images/logo.png";

  return (
    <Chrome>
      <nav className="breadcrumbs section-shell" aria-label="Migas de pan">
        <Link href="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link href="/#formaciones">Formaciones</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{course.name}</span>
      </nav>

      <section className="course-hero section-shell">
        <div className="ch-copy">
          <p className="eyebrow">{course.category} · {course.level}</p>
          <h1>{course.name}</h1>
          <p className="ch-intro">{course.intro}</p>
          <div className="ch-meta">
            <div><span className="chm-label">Duración</span><span>{course.duration}</span></div>
            <div><span className="chm-label">Modalidad</span><span>{course.mode}</span></div>
            <div><span className="chm-label">Certificación</span><span>{course.certificate}</span></div>
          </div>
          <div className="ch-price">
            <span className="chp-label">Inversión</span>
            <strong>{course.price}</strong>
          </div>
          <div className="ch-actions">
            <a className="button button-dark" href={pagoparUrl} target="_blank" rel="noreferrer">Inscribirme y pagar</a>
            <Link className="button button-ghost" href="/#formaciones">Ver todos los cursos</Link>
          </div>
        </div>
        <div className="ch-image">
          <NextImage src={courseImage} alt={course.name} fill sizes="(max-width: 900px) 100vw, 50vw" priority unoptimized />
        </div>
      </section>

      <section className="course-overview section-shell">
        <div className="section-heading">
          <p className="eyebrow">Sobre el curso</p>
          <h2>De qué se trata.</h2>
        </div>
        <p className="course-overview-body">{course.overview}</p>
      </section>

      <section className="course-learn section-shell">
        <div className="cl-head">
          <p className="eyebrow">Lo que vas a aprender</p>
          <h2>Al final del curso vas a poder…</h2>
        </div>
        <ul className="cl-list">
          {course.learn.map((item) => (
            <li key={item}>
              <span className="cl-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.5 4.5L19 7" /></svg>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="course-program section-shell">
        <div className="section-heading">
          <p className="eyebrow">Programa del curso</p>
          <h2>Contenido, módulo a módulo.</h2>
        </div>
        <ol className="cp-list">
          {course.modules.map((m, i) => (
            <li key={m.title}>
              <span className="cp-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="course-requirements section-shell">
        <div className="section-heading">
          <p className="eyebrow">Antes de inscribirte</p>
          <h2>Lo que vas a necesitar.</h2>
        </div>
        <ul className="cr-list">
          {course.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="course-instructor section-shell">
        <div className="ci-image">
          <NextImage src="/images/mirta.webp" alt="Mirta Mena" fill sizes="(max-width: 900px) 100vw, 40vw" unoptimized />
        </div>
        <div className="ci-copy">
          <p className="eyebrow">Instructora principal</p>
          <h2>Mirta Mena</h2>
          <p>
            Más de 30 años formando profesionales de la belleza. Directora general de Academia
            CHARME y referente en colorimetría en Paraguay. En alianza con HSB, la academia
            número 1 del mundo en color.
          </p>
        </div>
      </section>

      <section className="course-cta">
        <div className="cc-inner section-shell">
          <p className="eyebrow">¿Empezamos?</p>
          <h2>Reservá tu cupo hoy.</h2>
          <p>Escribinos por WhatsApp y te contamos cómo se paga, cuándo arranca el próximo grupo y todo lo que necesitás saber.</p>
          <a className="button button-light" href={pagoparUrl} target="_blank" rel="noreferrer">Inscribirme y pagar</a>
        </div>
      </section>

      {related.length > 0 && (
        <section className="course-related section-shell">
          <div className="section-heading">
            <p className="eyebrow">Seguí formándote</p>
            <h2>También te puede interesar.</h2>
          </div>
          <div className="cr-grid">
            {related.map((c) => (
              <Link key={c.slug} href={`/cursos/${c.slug}`} className="cr-card">
                <div className="cr-card-image">
                  <NextImage src={c.image || "/images/logo.png"} alt={c.name} fill sizes="(max-width: 900px) 100vw, 33vw" unoptimized />
                </div>
                <div className="cr-card-meta">
                  <h3>{c.name}</h3>
                  <p>{c.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Chrome>
  );
}
