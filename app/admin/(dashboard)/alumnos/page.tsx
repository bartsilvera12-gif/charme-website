"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import BackButton from "@/components/admin/BackButton";

type Student = { id: string; full_name: string | null; email: string | null };
type Course = { id: string; name: string };
type Enrollment = { id: string; student_id: string; course_id: string };

export default function AlumnosPage() {
  const supabase = createClient();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managing, setManaging] = useState<Student | null>(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [s, c, e] = await Promise.all([
      supabase.from("students").select("id, full_name, email").order("created_at", { ascending: false }),
      supabase.from("courses").select("id, name").eq("is_active", true).order("sort_order"),
      supabase.from("enrollments").select("id, student_id, course_id"),
    ]);
    if (s.error || c.error || e.error) setError((s.error || c.error || e.error)!.message);
    setStudents((s.data as Student[]) ?? []);
    setCourses((c.data as Course[]) ?? []);
    setEnrollments((e.data as Enrollment[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const enrolledCount = (studentId: string) => enrollments.filter((e) => e.student_id === studentId).length;
  const isEnrolled = (studentId: string, courseId: string) =>
    enrollments.find((e) => e.student_id === studentId && e.course_id === courseId);

  async function toggle(student: Student, courseId: string) {
    const existing = isEnrolled(student.id, courseId);
    if (existing) {
      await supabase.from("enrollments").delete().eq("id", existing.id);
    } else {
      await supabase.from("enrollments").insert({ student_id: student.id, course_id: courseId });
    }
    load();
  }

  const filtered = students.filter((s) =>
    (s.full_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
    (s.email ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-left"><BackButton /><h1>Alumnos</h1></div>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}

        {managing && (
          <div className="adm-card">
            <h2>Cursos de {managing.full_name || managing.email}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: -10, marginBottom: 16 }}>Marcá los cursos a los que tiene acceso este alumno.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {courses.map((c) => (
                <label key={c.id} className="adm-checkbox">
                  <input type="checkbox" checked={!!isEnrolled(managing.id, c.id)} onChange={() => toggle(managing, c.id)} />
                  {c.name}
                </label>
              ))}
              {courses.length === 0 && <p style={{ color: "var(--muted)" }}>No hay cursos activos.</p>}
            </div>
            <button className="adm-btn adm-btn-primary" style={{ marginTop: 18 }} onClick={() => setManaging(null)}>Listo</button>
          </div>
        )}

        <div className="adm-card">
          <input className="adm-input" placeholder="Buscar alumno por nombre o email…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 16, maxWidth: 360 }} />
          {loading ? <div className="adm-empty">Cargando…</div>
          : filtered.length === 0 ? <div className="adm-empty"><h3>Sin alumnos</h3><p>Los alumnos aparecen acá cuando se registran en el sitio.</p></div>
          : (
            <table className="adm-table">
              <thead><tr><th>Nombre</th><th>Email</th><th>Cursos</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.full_name || <span style={{ color: "var(--muted)" }}>Sin nombre</span>}</td>
                    <td style={{ color: "var(--muted)" }}>{s.email}</td>
                    <td><span className="adm-badge adm-badge-on">{enrolledCount(s.id)} curso(s)</span></td>
                    <td style={{ textAlign: "right" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 34, padding: "0 12px" }} onClick={() => setManaging(s)}>Gestionar cursos</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
