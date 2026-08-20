"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CampusHeader from "./CampusHeader";

type Lesson = { id: string; module_title: string | null; title: string; description: string | null; video_url: string | null; duration: string | null; sort_order: number };
type Theory = { id: string; title: string; content: string | null; file_url: string | null };

function embedUrl(url: string | null): { type: "iframe" | "video" | "none"; src: string } {
  if (!url) return { type: "none", src: "" };
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) return { type: "video", src: url };
  return { type: "none", src: "" };
}

export default function CourseCampus({ slug }: { slug: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [theory, setTheory] = useState<Theory[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<Lesson | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "denied">("loading");
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");

  const load = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { router.replace("/"); return; }
    setUserId(auth.user.id);
    setName((auth.user.user_metadata?.full_name as string) || auth.user.email || "alumna/o");

    const { data: course } = await supabase.from("courses").select("id, name").eq("slug", slug).maybeSingle();
    if (!course) { setState("denied"); return; }
    setCourseId(course.id);
    setCourseName(course.name);

    const { data: enr } = await supabase.from("enrollments").select("id").eq("course_id", course.id).maybeSingle();
    if (!enr) { setState("denied"); return; }

    const [l, t, p] = await Promise.all([
      supabase.from("course_lessons").select("*").eq("course_id", course.id).eq("is_active", true).order("sort_order"),
      supabase.from("course_theory").select("id, title, content, file_url").eq("course_id", course.id).eq("is_active", true).order("sort_order"),
      supabase.from("lesson_progress").select("lesson_id"),
    ]);
    const ls = (l.data as Lesson[]) ?? [];
    setLessons(ls);
    setTheory((t.data as Theory[]) ?? []);
    setDone(new Set((p.data ?? []).map((x: any) => x.lesson_id)));
    setCurrent(ls[0] ?? null);
    setState("ready");
  }, [supabase, slug, router]);

  useEffect(() => { load(); }, [load]);

  async function toggleComplete(lesson: Lesson) {
    const already = done.has(lesson.id);
    if (already) {
      await supabase.from("lesson_progress").delete().eq("lesson_id", lesson.id).eq("student_id", userId);
      const n = new Set(done); n.delete(lesson.id); setDone(n);
    } else {
      await supabase.from("lesson_progress").upsert({ student_id: userId, lesson_id: lesson.id, completed: true }, { onConflict: "student_id,lesson_id" });
      const n = new Set(done); n.add(lesson.id); setDone(n);
      // ¿completó todo? → emitir certificado
      if (lessons.every((x) => n.has(x.id))) {
        await supabase.from("certificates").upsert({ student_id: userId, course_id: courseId }, { onConflict: "student_id,course_id" });
      }
    }
  }

  if (state === "loading") return <main className="nosotros"><CampusHeader studentName={name} /><section className="section-shell" style={{ padding: "80px 0", textAlign: "center", color: "var(--muted)" }}>Cargando…</section></main>;
  if (state === "denied") return (
    <main className="nosotros"><CampusHeader studentName={name} />
      <section className="section-shell" style={{ padding: "100px 0", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--serif)", marginBottom: 12 }}>No tenés acceso a este curso</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>Este curso todavía no está asignado a tu cuenta.</p>
        <Link className="button button-dark" href="/panel">Volver a mi campus</Link>
      </section>
    </main>
  );

  // agrupa lecciones por módulo (preservando el orden)
  const modules: { title: string; items: Lesson[] }[] = [];
  for (const l of lessons) {
    const key = l.module_title || "Contenido";
    let g = modules.find((m) => m.title === key);
    if (!g) { g = { title: key, items: [] }; modules.push(g); }
    g.items.push(l);
  }
  const embed = current ? embedUrl(current.video_url) : { type: "none" as const, src: "" };
  const pct = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;

  return (
    <main className="nosotros">
      <CampusHeader studentName={name} />
      <section className="section-shell" style={{ paddingTop: 26, paddingBottom: 10 }}>
        <Link href="/panel" style={{ fontSize: 13, color: "var(--muted)" }}>← Volver a mi campus</Link>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px,3.5vw,44px)", margin: "10px 0 6px", letterSpacing: "-.02em" }}>{courseName}</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Progreso: {pct}% · {done.size}/{lessons.length} clases</p>
      </section>

      <section className="section-shell" style={{ paddingBottom: 60, display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 28, alignItems: "start" }}>
        {/* Reproductor + descripción */}
        <div>
          <div style={{ position: "relative", aspectRatio: "16/9", background: "#0c0a09", borderRadius: 14, overflow: "hidden" }}>
            {current && embed.type === "iframe" && <iframe src={embed.src} title={current.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen style={{ width: "100%", height: "100%", border: 0 }} />}
            {current && embed.type === "video" && <video src={embed.src} controls playsInline style={{ width: "100%", height: "100%" }} />}
            {(!current || embed.type === "none") && <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#8a8377" }}>{current ? "Esta clase todavía no tiene video." : "Seleccioná una clase."}</div>}
          </div>
          {current && (
            <div style={{ marginTop: 20 }}>
              {current.module_title && <p style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--champagne)", margin: 0 }}>{current.module_title}</p>}
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, margin: "6px 0 12px" }}>{current.title}</h2>
              {current.description && <p style={{ color: "var(--muted)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{current.description}</p>}
              <button className="button button-dark" style={{ marginTop: 16 }} onClick={() => toggleComplete(current)}>
                {done.has(current.id) ? "✓ Completada — desmarcar" : "Marcar como completada"}
              </button>
            </div>
          )}

          {theory.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, margin: "0 0 16px" }}>Teoría</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {theory.map((t) => (
                  <div key={t.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, background: "#fff" }}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, margin: "0 0 6px" }}>{t.title}</h3>
                    {t.content && <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 10px", whiteSpace: "pre-line" }}>{t.content}</p>}
                    {t.file_url && <a href={t.file_url} target="_blank" rel="noreferrer" className="button button-outline" style={{ minHeight: 40 }}>📄 Ver / descargar PDF</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar contenido */}
        <aside style={{ border: "1px solid var(--line)", borderRadius: 14, background: "#fff", overflow: "hidden", position: "sticky", top: 20 }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 18, margin: 0 }}>Contenido del curso</p>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0" }}>{modules.length} módulo(s) · {lessons.length} clase(s)</p>
          </div>
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {modules.map((m) => (
              <div key={m.title}>
                <div style={{ padding: "12px 20px 6px", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--champagne)" }}>{m.title}</div>
                {m.items.map((l) => (
                  <button key={l.id} onClick={() => setCurrent(l)}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", border: 0, cursor: "pointer",
                      background: current?.id === l.id ? "var(--gold-soft, rgba(200,173,126,.14))" : "transparent", padding: "10px 20px", borderLeft: current?.id === l.id ? "3px solid var(--champagne)" : "3px solid transparent" }}>
                    <span style={{ width: 18, height: 18, borderRadius: 999, border: "1.5px solid var(--line)", display: "grid", placeItems: "center", fontSize: 11, flexShrink: 0, background: done.has(l.id) ? "var(--champagne)" : "transparent", color: "#fff", borderColor: done.has(l.id) ? "var(--champagne)" : "var(--line)" }}>{done.has(l.id) ? "✓" : ""}</span>
                    <span style={{ fontSize: 14 }}>{l.title}</span>
                  </button>
                ))}
              </div>
            ))}
            {lessons.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>Este curso todavía no tiene clases cargadas.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}
