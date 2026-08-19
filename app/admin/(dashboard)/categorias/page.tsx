"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slug";

type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

export default function CategoriasPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("course_categories")
      .select("id, name, slug, sort_order, is_active")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setItems(data as Category[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing?.name?.trim()) return;
    setSaving(true);
    setError(null);
    const payload = {
      name: editing.name.trim(),
      slug: (editing.slug?.trim() || slugify(editing.name)).trim(),
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? items.length,
    };
    const res = editing.id
      ? await supabase.from("course_categories").update(payload).eq("id", editing.id)
      : await supabase.from("course_categories").insert(payload);
    if (res.error) {
      setError(res.error.message.includes("duplicate") ? "Ya existe una categoría con ese slug." : res.error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function remove(c: Category) {
    if (!confirm(`¿Eliminar la categoría "${c.name}"? Las formaciones quedarán sin categoría.`)) return;
    const { error } = await supabase.from("course_categories").delete().eq("id", c.id);
    if (error) { setError(error.message); return; }
    load();
  }

  async function toggle(c: Category) {
    await supabase.from("course_categories").update({ is_active: !c.is_active }).eq("id", c.id);
    load();
  }

  return (
    <>
      <header className="adm-topbar">
        <h1>Categorías</h1>
        <button className="adm-btn adm-btn-primary" onClick={() => setEditing({ name: "", is_active: true })}>+ Nueva categoría</button>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}

        {editing && (
          <div className="adm-card">
            <h2>{editing.id ? "Editar categoría" : "Nueva categoría"}</h2>
            <div className="adm-field">
              <label className="adm-label">Nombre</label>
              <input className="adm-input" value={editing.name ?? ""} autoFocus
                onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Slug</label>
              <input className="adm-input" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <label className="adm-checkbox" style={{ marginBottom: 16 }}>
              <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
              Activa
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving || !editing.name?.trim()}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="adm-card">
          {loading ? (
            <div className="adm-empty">Cargando…</div>
          ) : items.length === 0 ? (
            <div className="adm-empty"><h3>Sin categorías</h3><p>Creá la primera categoría para clasificar las formaciones.</p></div>
          ) : (
            <table className="adm-table">
              <thead><tr><th>Nombre</th><th>Slug</th><th>Estado</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td style={{ color: "var(--muted)" }}>{c.slug}</td>
                    <td><button className={`adm-badge ${c.is_active ? "adm-badge-on" : "adm-badge-off"}`} onClick={() => toggle(c)} style={{ border: 0, cursor: "pointer" }}>{c.is_active ? "Activa" : "Inactiva"}</button></td>
                    <td style={{ textAlign: "right" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 34, padding: "0 12px", marginRight: 8 }} onClick={() => setEditing(c)}>Editar</button>
                      <button className="adm-btn adm-btn-danger" style={{ minHeight: 34, padding: "0 12px" }} onClick={() => remove(c)}>Eliminar</button>
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
