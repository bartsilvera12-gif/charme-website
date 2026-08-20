"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BackButton from "@/components/admin/BackButton";
import FileUpload from "@/components/admin/FileUpload";

type Lesson = {
  id: string; course_id: string; module_title: string | null; title: string;
  description: string | null; video_url: string | null; duration: string | null;
  is_active: boolean; sort_order: number;
};
type Theory = {
  id: string; course_id: string; title: string; content: string | null;
  file_url: string | null; is_active: boolean; sort_order: number;
};

function Contenido() {
  const params = useSearchParams();
  const courseId = params.get("id") ?? "";
  const supabase = createClient();

  const [courseName, setCourseName] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [theory, setTheory] = useState<Theory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<Partial<Lesson> | null>(null);
  const [editTheory, setEditTheory] = useState<Partial<Theory> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, l, t] = await Promise.all([
      supabase.from("courses").select("name").eq("id", courseId).maybeSingle(),
      supabase.from("course_lessons").select("*").eq("course_id", courseId).order("sort_order"),
      supabase.from("course_theory").select("*").eq("course_id", courseId).order("sort_order"),
    ]);
    if (c.error || l.error || t.error) setError((c.error || l.error || t.error)!.message);
    setCourseName(c.data?.name ?? "Curso");
    setLessons((l.data as Lesson[]) ?? []);
    setTheory((t.data as Theory[]) ?? []);
    setLoading(false);
  }, [supabase, courseId]);

  useEffect(() => { if (courseId) load(); }, [courseId, load]);

  async function saveLesson() {
    if (!editLesson?.title?.trim()) { setError("El título de la clase es obligatorio."); return; }
    setSaving(true); setError(null);
    const payload = {
      course_id: courseId, module_title: editLesson.module_title || null, title: editLesson.title.trim(),
      description: editLesson.description || null, video_url: editLesson.video_url || null,
      duration: editLesson.duration || null, is_active: editLesson.is_active ?? true,
      sort_order: editLesson.sort_order ?? lessons.length,
    };
    const res = editLesson.id
      ? await supabase.from("course_lessons").update(payload).eq("id", editLesson.id)
      : await supabase.from("course_lessons").insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    setEditLesson(null); load();
  }
  async function delLesson(l: Lesson) {
    if (!confirm(`¿Eliminar la clase "${l.title}"?`)) return;
    await supabase.from("course_lessons").delete().eq("id", l.id); load();
  }
  async function moveLesson(l: Lesson, dir: number) {
    const i = lessons.findIndex((x) => x.id === l.id); const o = lessons[i + dir];
    if (!o) return;
    await Promise.all([
      supabase.from("course_lessons").update({ sort_order: o.sort_order }).eq("id", l.id),
      supabase.from("course_lessons").update({ sort_order: l.sort_order }).eq("id", o.id),
    ]); load();
  }

  async function saveTheory() {
    if (!editTheory?.title?.trim()) { setError("El título de la teoría es obligatorio."); return; }
    setSaving(true); setError(null);
    const payload = {
      course_id: courseId, title: editTheory.title.trim(), content: editTheory.content || null,
      file_url: editTheory.file_url || null, is_active: editTheory.is_active ?? true,
      sort_order: editTheory.sort_order ?? theory.length,
    };
    const res = editTheory.id
      ? await supabase.from("course_theory").update(payload).eq("id", editTheory.id)
      : await supabase.from("course_theory").insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    setEditTheory(null); load();
  }
  async function delTheory(t: Theory) {
    if (!confirm(`¿Eliminar la teoría "${t.title}"?`)) return;
    await supabase.from("course_theory").delete().eq("id", t.id); load();
  }

  if (!courseId) return <div className="adm-content"><div className="adm-alert adm-alert-error">Falta el curso.</div></div>;

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-left"><BackButton /><h1>Contenido · {courseName}</h1></div>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        {loading ? <div className="adm-empty">Cargando…</div> : (
          <>
            {/* ---------- CLASES ---------- */}
            <div className="adm-card">
              <h2>Clases (video-lecciones)</h2>
              {editLesson && (
                <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div className="adm-grid2">
                    <div className="adm-field"><label className="adm-label">Módulo</label><input className="adm-input" value={editLesson.module_title ?? ""} placeholder="Ej: Módulo 1 - Día 1" onChange={(e) => setEditLesson({ ...editLesson, module_title: e.target.value })} /></div>
                    <div className="adm-field"><label className="adm-label">Título de la clase</label><input className="adm-input" value={editLesson.title ?? ""} onChange={(e) => setEditLesson({ ...editLesson, title: e.target.value })} /></div>
                    <div className="adm-field"><label className="adm-label">Link del video (YouTube / Vimeo / URL)</label><input className="adm-input" value={editLesson.video_url ?? ""} placeholder="https://youtube.com/watch?v=…" onChange={(e) => setEditLesson({ ...editLesson, video_url: e.target.value })} /></div>
                    <div className="adm-field"><label className="adm-label">Duración (opcional)</label><input className="adm-input" value={editLesson.duration ?? ""} placeholder="12 min" onChange={(e) => setEditLesson({ ...editLesson, duration: e.target.value })} /></div>
                  </div>
                  <div className="adm-field"><label className="adm-label">Descripción</label><textarea className="adm-textarea" value={editLesson.description ?? ""} onChange={(e) => setEditLesson({ ...editLesson, description: e.target.value })} /></div>
                  <label className="adm-checkbox" style={{ marginBottom: 14 }}><input type="checkbox" checked={editLesson.is_active ?? true} onChange={(e) => setEditLesson({ ...editLesson, is_active: e.target.checked })} /> Activa</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="adm-btn adm-btn-primary" onClick={saveLesson} disabled={saving}>{saving ? "Guardando…" : "Guardar clase"}</button>
                    <button className="adm-btn adm-btn-ghost" onClick={() => setEditLesson(null)}>Cancelar</button>
                  </div>
                </div>
              )}
              {!editLesson && <button className="adm-btn adm-btn-primary" style={{ marginBottom: 16 }} onClick={() => setEditLesson({ is_active: true })}>+ Agregar clase</button>}
              {lessons.length === 0 ? <div className="adm-empty"><p>Sin clases todavía.</p></div> : (
                <table className="adm-table">
                  <thead><tr><th>Orden</th><th>Módulo</th><th>Clase</th><th>Video</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
                  <tbody>
                    {lessons.map((l) => (
                      <tr key={l.id}>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <button className="adm-btn adm-btn-ghost" style={{ minHeight: 26, padding: "0 7px" }} onClick={() => moveLesson(l, -1)}>↑</button>{" "}
                          <button className="adm-btn adm-btn-ghost" style={{ minHeight: 26, padding: "0 7px" }} onClick={() => moveLesson(l, 1)}>↓</button>
                        </td>
                        <td style={{ color: "var(--muted)" }}>{l.module_title ?? "—"}</td>
                        <td>{l.title}</td>
                        <td>{l.video_url ? "✓" : <span style={{ color: "var(--muted)" }}>sin video</span>}</td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button className="adm-btn adm-btn-ghost" style={{ minHeight: 32, padding: "0 10px", marginRight: 6 }} onClick={() => setEditLesson(l)}>Editar</button>
                          <button className="adm-btn adm-btn-danger" style={{ minHeight: 32, padding: "0 10px" }} onClick={() => delLesson(l)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ---------- TEORÍA ---------- */}
            <div className="adm-card">
              <h2>Teoría (material / PDF)</h2>
              {editTheory && (
                <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div className="adm-field"><label className="adm-label">Título</label><input className="adm-input" value={editTheory.title ?? ""} onChange={(e) => setEditTheory({ ...editTheory, title: e.target.value })} /></div>
                  <div className="adm-field"><label className="adm-label">Texto (opcional)</label><textarea className="adm-textarea" value={editTheory.content ?? ""} onChange={(e) => setEditTheory({ ...editTheory, content: e.target.value })} /></div>
                  <FileUpload value={editTheory.file_url ?? null} onChange={(url) => setEditTheory({ ...editTheory, file_url: url })} folder="theory" label="PDF de teoría" />
                  <label className="adm-checkbox" style={{ margin: "6px 0 14px" }}><input type="checkbox" checked={editTheory.is_active ?? true} onChange={(e) => setEditTheory({ ...editTheory, is_active: e.target.checked })} /> Activa</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="adm-btn adm-btn-primary" onClick={saveTheory} disabled={saving}>{saving ? "Guardando…" : "Guardar teoría"}</button>
                    <button className="adm-btn adm-btn-ghost" onClick={() => setEditTheory(null)}>Cancelar</button>
                  </div>
                </div>
              )}
              {!editTheory && <button className="adm-btn adm-btn-primary" style={{ marginBottom: 16 }} onClick={() => setEditTheory({ is_active: true })}>+ Agregar teoría</button>}
              {theory.length === 0 ? <div className="adm-empty"><p>Sin teoría todavía.</p></div> : (
                <table className="adm-table">
                  <thead><tr><th>Título</th><th>Archivo</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
                  <tbody>
                    {theory.map((t) => (
                      <tr key={t.id}>
                        <td>{t.title}</td>
                        <td>{t.file_url ? <a href={t.file_url} target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }}>Ver PDF</a> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button className="adm-btn adm-btn-ghost" style={{ minHeight: 32, padding: "0 10px", marginRight: 6 }} onClick={() => setEditTheory(t)}>Editar</button>
                          <button className="adm-btn adm-btn-danger" style={{ minHeight: 32, padding: "0 10px" }} onClick={() => delTheory(t)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function ContenidoPage() {
  return <Suspense fallback={<div className="adm-content"><div className="adm-empty">Cargando…</div></div>}><Contenido /></Suspense>;
}
