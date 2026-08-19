"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Recent = { slug: string; name: string; is_active: boolean; updated_at: string };
type Data = {
  coursesTotal: number; coursesActive: number; gallery: number;
  professionals: number; faqs: number; recent: Recent[];
};

export default function DashboardPage() {
  const supabase = createClient();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const count = async (table: string, active?: boolean) => {
        let q = supabase.from(table).select("*", { count: "exact", head: true });
        if (active) q = q.eq("is_active", true);
        const { count: c, error } = await q;
        if (error) throw error;
        return c ?? 0;
      };
      const [coursesTotal, coursesActive, gallery, professionals, faqs] = await Promise.all([
        count("courses"), count("courses", true), count("gallery_items"),
        count("professionals"), count("faqs"),
      ]);
      const { data: recent } = await supabase
        .from("courses").select("slug, name, is_active, updated_at")
        .order("updated_at", { ascending: false }).limit(5);
      setData({ coursesTotal, coursesActive, gallery, professionals, faqs, recent: (recent as Recent[]) ?? [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo conectar con la base de datos.");
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <header className="adm-topbar"><h1>Dashboard</h1></header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">No se pudo cargar la información. {error}</div>}
        {!data && !error && <div className="adm-empty">Cargando…</div>}
        {data && (
          <>
            <div className="adm-stats">
              {[
                { label: "Formaciones activas", value: data.coursesActive, href: "/admin/formaciones" },
                { label: "Formaciones totales", value: data.coursesTotal, href: "/admin/formaciones" },
                { label: "Imágenes / videos", value: data.gallery, href: "/admin/galeria" },
              ].map((s) => (
                <Link key={s.label} href={s.href} className="adm-stat" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div className="n">{s.value}</div>
                  <div className="l">{s.label}</div>
                </Link>
              ))}
            </div>

            <div className="adm-card">
              <h2>Últimas formaciones modificadas</h2>
              {data.recent.length === 0 ? (
                <div className="adm-empty"><h3>Sin formaciones</h3></div>
              ) : (
                <table className="adm-table">
                  <thead><tr><th>Formación</th><th>Estado</th><th>Actualizada</th></tr></thead>
                  <tbody>
                    {data.recent.map((c) => (
                      <tr key={c.slug}>
                        <td>{c.name}</td>
                        <td><span className={`adm-badge ${c.is_active ? "adm-badge-on" : "adm-badge-off"}`}>{c.is_active ? "Activa" : "Inactiva"}</span></td>
                        <td style={{ color: "var(--muted)" }}>{new Date(c.updated_at).toLocaleDateString("es-PY", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="adm-card">
              <h2>Accesos rápidos</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link className="adm-btn adm-btn-ghost" href="/admin/formaciones">Formaciones</Link>
                <Link className="adm-btn adm-btn-ghost" href="/admin/galeria">Galería</Link>
                <Link className="adm-btn adm-btn-ghost" href="/admin/inicio">Inicio</Link>
                <Link className="adm-btn adm-btn-ghost" href="/admin/configuracion">Configuración</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
