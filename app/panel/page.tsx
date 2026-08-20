"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CampusHeader from "@/components/campus/CampusHeader";

type Course = { id: string; slug: string; name: string; image_url: string | null; level: string | null };
type CourseCard = Course & { total: number; done: number; certified: boolean };

export default function PanelPage() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cards, setCards] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { router.replace("/"); return; }
    setName((auth.user.user_metadata?.full_name as string) || auth.user.email || "alumna/o");
    setEmail(auth.user.email || "");

    const [enr, lessons, prog, certs] = await Promise.all([
      supabase.from("enrollments").select("course:courses(id, slug, name, image_url, level)"),
      supabase.from("course_lessons").select("id, course_id").eq("is_active", true),
      supabase.from("lesson_progress").select("lesson_id"),
      supabase.from("certificates").select("course_id"),
    ]);

    const courses: Course[] = (enr.data ?? [])
      .map((e: any) => (Array.isArray(e.course) ? e.course[0] : e.course))
      .filter(Boolean);
    const lessonsByCourse = new Map<string, string[]>();
    for (const l of (lessons.data ?? []) as { id: string; course_id: string }[]) {
      const arr = lessonsByCourse.get(l.course_id) ?? [];
      arr.push(l.id); lessonsByCourse.set(l.course_id, arr);
    }
    const doneSet = new Set((prog.data ?? []).map((p: any) => p.lesson_id));
    const certSet = new Set((certs.data ?? []).map((c: any) => c.course_id));

    setCards(courses.map((c) => {
      const lids = lessonsByCourse.get(c.id) ?? [];
      const done = lids.filter((id) => doneSet.has(id)).length;
      return { ...c, total: lids.length, done, certified: certSet.has(c.id) };
    }));
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="nosotros">
      <CampusHeader studentName={name} />
      <section className="section-shell" style={{ paddingTop: 40, paddingBottom: 20 }}>
        <p className="eyebrow">Área del alumno</p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(34px,4vw,52px)", margin: "12px 0 6px", letterSpacing: "-.02em" }}>Hola, {name}</h1>
        <p style={{ color: "var(--muted)" }}>{email}</p>
      </section>

      <section className="section-shell" style={{ paddingBottom: 80 }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, margin: "0 0 24px" }}>Mis cursos</h2>
        {loading ? <p style={{ color: "var(--muted)" }}>Cargando…</p>
        : cards.length === 0 ? (
          <div style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 48, textAlign: "center", color: "var(--muted)", background: "#fff" }}>
            <h3 style={{ fontFamily: "var(--serif)", color: "var(--ink)", marginBottom: 8 }}>Todavía no tenés cursos asignados</h3>
            <p>Cuando la academia te inscriba en un curso, va a aparecer acá. <Link href="/#formaciones" style={{ color: "var(--champagne)" }}>Ver formaciones →</Link></p>
          </div>
        ) : (
          <div className="campus-grid">
            {cards.map((c) => {
              const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <Link key={c.id} href={`/curso/${c.slug}`} style={{ textDecoration: "none", color: "inherit", background: "#fff", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", display: "block", transition: "box-shadow .3s, transform .3s" }}>
                  <div style={{ position: "relative", aspectRatio: "16/10", background: "#e9e2d7" }}>
                    <NextImage src={c.image_url || "/images/logo.png"} alt={c.name} fill sizes="320px" style={{ objectFit: "cover" }} unoptimized />
                    {c.certified && <span style={{ position: "absolute", top: 10, right: 10, background: "var(--ink)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 999 }}>CERTIFICADO ✓</span>}
                  </div>
                  <div style={{ padding: "18px 20px 22px" }}>
                    {c.level && <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--champagne)", margin: "0 0 6px" }}>{c.level}</p>}
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, margin: "0 0 14px" }}>{c.name}</h3>
                    <div style={{ height: 6, background: "var(--line)", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#c8ad7e,#a88c5f)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                      <span>{c.total ? `${c.done}/${c.total} clases` : "Sin clases aún"}</span>
                      <span>{c.done > 0 ? "Retomar →" : "Empezar →"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <footer>
        <div className="copyright">
          <span>© Academia CHARME. Todos los derechos reservados.</span>
          <span className="dev-credit">Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noreferrer">Neura</a></span>
        </div>
      </footer>
    </main>
  );
}
