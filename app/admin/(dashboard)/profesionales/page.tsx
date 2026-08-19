"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import BackButton from "@/components/admin/BackButton";

type P = {
  id: string; name: string; role_title: string | null; eyebrow: string | null;
  short_description: string | null; biography: string | null; image_url: string | null;
  is_active: boolean; is_featured: boolean; sort_order: number;
};

export default function ProfesionalesPage() {
  const supabase = createClient();
  const [items, setItems] = useState<P[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<P> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("professionals").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message); else setItems((data as P[]) ?? []);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing?.name?.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError(null);
    const payload = {
      name: editing.name.trim(), role_title: editing.role_title || null, eyebrow: editing.eyebrow || null,
      short_description: editing.short_description || null, biography: editing.biography || null,
      image_url: editing.image_url ?? null, is_active: editing.is_active ?? true,
      is_featured: editing.is_featured ?? false, sort_order: editing.sort_order ?? items.length,
    };
    const res = editing.id
      ? await supabase.from("professionals").update(payload).eq("id", editing.id)
      : await supabase.from("professionals").insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    setEditing(null); load();
  }
  async function remove(p: P) {
    if (!confirm(`¿Eliminar a ${p.name}?`)) return;
    const { error } = await supabase.from("professionals").delete().eq("id", p.id);
    if (error) setError(error.message); else load();
  }
  async function toggle(p: P, field: "is_active" | "is_featured") {
    await supabase.from("professionals").update({ [field]: !p[field] }).eq("id", p.id); load();
  }

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-left"><BackButton /><h1>Profesionales</h1></div>
        <button className="adm-btn adm-btn-primary" onClick={() => setEditing({ is_active: true, is_featured: false })}>+ Nuevo profesional</button>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        {editing && (
          <div className="adm-card">
            <h2>{editing.id ? "Editar profesional" : "Nuevo profesional"}</h2>
            <ImageUpload value={editing.image_url ?? null} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="professionals" label="Foto" />
            <div className="adm-grid2">
              <div className="adm-field"><label className="adm-label">Nombre</label><input className="adm-input" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="adm-field"><label className="adm-label">Cargo</label><input className="adm-input" value={editing.role_title ?? ""} onChange={(e) => setEditing({ ...editing, role_title: e.target.value })} placeholder="Master artist" /></div>
              <div className="adm-field"><label className="adm-label">Eyebrow (etiqueta)</label><input className="adm-input" value={editing.eyebrow ?? ""} onChange={(e) => setEditing({ ...editing, eyebrow: e.target.value })} /></div>
            </div>
            <div className="adm-field"><label className="adm-label">Descripción corta</label><textarea className="adm-textarea" value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} /></div>
            <div className="adm-field"><label className="adm-label">Biografía</label><textarea className="adm-textarea" value={editing.biography ?? ""} onChange={(e) => setEditing({ ...editing, biography: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
              <label className="adm-checkbox"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Activo</label>
              <label className="adm-checkbox"><input type="checkbox" checked={editing.is_featured ?? false} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} /> Destacado (aparece en la home)</label>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
              <button className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </div>
        )}
        <div className="adm-card">
          {loading ? <div className="adm-empty">Cargando…</div>
          : items.length === 0 ? <div className="adm-empty"><h3>Sin profesionales</h3><p>Agregá el primero.</p></div>
          : (
            <table className="adm-table">
              <thead><tr><th>Nombre</th><th>Cargo</th><th>Estado</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}{p.is_featured && <span className="adm-badge adm-badge-on" style={{ marginLeft: 8 }}>Destacado</span>}</td>
                    <td style={{ color: "var(--muted)" }}>{p.role_title ?? "—"}</td>
                    <td><button className={`adm-badge ${p.is_active ? "adm-badge-on" : "adm-badge-off"}`} style={{ border: 0, cursor: "pointer" }} onClick={() => toggle(p, "is_active")}>{p.is_active ? "Activo" : "Inactivo"}</button></td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 34, padding: "0 10px", marginRight: 6 }} onClick={() => toggle(p, "is_featured")}>{p.is_featured ? "Quitar destacado" : "Destacar"}</button>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 34, padding: "0 12px", marginRight: 6 }} onClick={() => setEditing(p)}>Editar</button>
                      <button className="adm-btn adm-btn-danger" style={{ minHeight: 34, padding: "0 12px" }} onClick={() => remove(p)}>Eliminar</button>
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
