"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type F = { id: string; question: string; answer: string; is_active: boolean; sort_order: number };

export default function FaqsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<F[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<F> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message); else setItems((data as F[]) ?? []);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing?.question?.trim() || !editing?.answer?.trim()) { setError("Pregunta y respuesta son obligatorias."); return; }
    setSaving(true); setError(null);
    const payload = {
      question: editing.question.trim(), answer: editing.answer.trim(),
      is_active: editing.is_active ?? true, sort_order: editing.sort_order ?? items.length,
    };
    const res = editing.id
      ? await supabase.from("faqs").update(payload).eq("id", editing.id)
      : await supabase.from("faqs").insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    setEditing(null); load();
  }
  async function remove(f: F) {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", f.id);
    if (error) setError(error.message); else load();
  }
  async function toggle(f: F) {
    await supabase.from("faqs").update({ is_active: !f.is_active }).eq("id", f.id); load();
  }
  async function move(f: F, dir: number) {
    const idx = items.findIndex((x) => x.id === f.id); const other = items[idx + dir];
    if (!other) return;
    await Promise.all([
      supabase.from("faqs").update({ sort_order: other.sort_order }).eq("id", f.id),
      supabase.from("faqs").update({ sort_order: f.sort_order }).eq("id", other.id),
    ]); load();
  }

  return (
    <>
      <header className="adm-topbar">
        <h1>Preguntas frecuentes</h1>
        <button className="adm-btn adm-btn-primary" onClick={() => setEditing({ is_active: true })}>+ Nueva pregunta</button>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        {editing && (
          <div className="adm-card">
            <h2>{editing.id ? "Editar pregunta" : "Nueva pregunta"}</h2>
            <div className="adm-field"><label className="adm-label">Pregunta</label><input className="adm-input" value={editing.question ?? ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></div>
            <div className="adm-field"><label className="adm-label">Respuesta</label><textarea className="adm-textarea" value={editing.answer ?? ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} /></div>
            <label className="adm-checkbox" style={{ marginBottom: 16 }}><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Activa</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
              <button className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </div>
        )}
        <div className="adm-card">
          {loading ? <div className="adm-empty">Cargando…</div>
          : items.length === 0 ? <div className="adm-empty"><h3>Sin preguntas</h3><p>Agregá la primera.</p></div>
          : (
            <table className="adm-table">
              <thead><tr><th>Orden</th><th>Pregunta</th><th>Estado</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px" }} onClick={() => move(f, -1)}>↑</button>{" "}
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px" }} onClick={() => move(f, 1)}>↓</button>
                    </td>
                    <td>{f.question}</td>
                    <td><button className={`adm-badge ${f.is_active ? "adm-badge-on" : "adm-badge-off"}`} style={{ border: 0, cursor: "pointer" }} onClick={() => toggle(f)}>{f.is_active ? "Activa" : "Inactiva"}</button></td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 34, padding: "0 12px", marginRight: 6 }} onClick={() => setEditing(f)}>Editar</button>
                      <button className="adm-btn adm-btn-danger" style={{ minHeight: 34, padding: "0 12px" }} onClick={() => remove(f)}>Eliminar</button>
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
