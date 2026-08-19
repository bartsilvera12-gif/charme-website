"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Row = {
  id: string; slug: string; name: string; price: string | null;
  is_active: boolean; is_featured: boolean; sort_order: number;
  category: { name: string } | { name: string }[] | null;
};

export default function FormacionesListPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("id, slug, name, price, is_active, is_featured, sort_order, category:course_categories(name)")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const catName = (c: Row["category"]) => (Array.isArray(c) ? c[0]?.name : c?.name) ?? "—";

  async function toggle(r: Row, field: "is_active" | "is_featured") {
    await supabase.from("courses").update({ [field]: !r[field] }).eq("id", r.id);
    load();
  }
  async function move(r: Row, dir: number) {
    const idx = rows.findIndex((x) => x.id === r.id);
    const other = rows[idx + dir];
    if (!other) return;
    await Promise.all([
      supabase.from("courses").update({ sort_order: other.sort_order }).eq("id", r.id),
      supabase.from("courses").update({ sort_order: r.sort_order }).eq("id", other.id),
    ]);
    load();
  }
  async function remove(r: Row) {
    if (!confirm(`¿Eliminar la formación "${r.name}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from("courses").delete().eq("id", r.id);
    if (error) setError(error.message);
    else load();
  }

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <header className="adm-topbar">
        <h1>Formaciones</h1>
        <Link href="/admin/formaciones/nueva" className="adm-btn adm-btn-primary">+ Nueva formación</Link>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        <div className="adm-card">
          <input className="adm-input" placeholder="Buscar formación…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 16, maxWidth: 320 }} />
          {loading ? (
            <div className="adm-empty">Cargando…</div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty"><h3>Sin formaciones</h3><p>Creá tu primera formación con el botón de arriba.</p></div>
          ) : (
            <table className="adm-table">
              <thead><tr><th>Orden</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--muted)" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px" }} onClick={() => move(r, -1)}>↑</button>{" "}
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px" }} onClick={() => move(r, 1)}>↓</button>
                    </td>
                    <td>{r.name}</td>
                    <td style={{ color: "var(--muted)" }}>{catName(r.category)}</td>
                    <td>{r.price ?? "—"}</td>
                    <td><button className={`adm-badge ${r.is_active ? "adm-badge-on" : "adm-badge-off"}`} style={{ border: 0, cursor: "pointer" }} onClick={() => toggle(r, "is_active")}>{r.is_active ? "Activa" : "Inactiva"}</button></td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Link href={`/admin/formaciones/editar?id=${r.id}`} className="adm-btn adm-btn-ghost" style={{ minHeight: 34, padding: "0 12px", marginRight: 6 }}>Editar</Link>
                      <button className="adm-btn adm-btn-danger" style={{ minHeight: 34, padding: "0 12px" }} onClick={() => remove(r)}>Eliminar</button>
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
