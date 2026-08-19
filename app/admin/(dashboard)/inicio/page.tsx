"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import BackButton from "@/components/admin/BackButton";

type Section = {
  section: string; eyebrow: string | null; title: string | null; subtitle: string | null;
  body: string | null; cta_label: string | null; cta_url: string | null; image_url: string | null;
  extra: Record<string, any> | null;
};

const LABELS: Record<string, string> = {
  hero: "Hero (portada)", academia: "Academia / Experiencia", formaciones: "Formaciones",
  masterclass: "Masterclass", online: "Experiencia online", final_cta: "CTA final",
};
const ORDER = ["hero", "academia", "formaciones", "masterclass", "online", "final_cta"];

export default function InicioPage() {
  const supabase = createClient();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [okKey, setOkKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("home_content").select("section, eyebrow, title, subtitle, body, cta_label, cta_url, image_url, extra");
    if (error) setError(error.message);
    else {
      const map = new Map((data as Section[]).map((s) => [s.section, s]));
      setSections(ORDER.filter((k) => map.has(k)).map((k) => map.get(k)!));
    }
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const update = (i: number, patch: Partial<Section>) => {
    setSections((prev) => prev.map((s, k) => (k === i ? { ...s, ...patch } : s)));
    setOkKey(null);
  };

  async function save(s: Section) {
    setSavingKey(s.section); setError(null); setOkKey(null);
    const { error } = await supabase.from("home_content").update({
      eyebrow: s.eyebrow || null, title: s.title || null, subtitle: s.subtitle || null,
      body: s.body || null, cta_label: s.cta_label || null, cta_url: s.cta_url || null,
      image_url: s.image_url, extra: s.extra ?? {},
    }).eq("section", s.section);
    setSavingKey(null);
    if (error) { setError(error.message); return; }
    setOkKey(s.section);
  }

  if (loading) return <><header className="adm-topbar"><div className="adm-topbar-left"><BackButton /><h1>Inicio</h1></div></header><div className="adm-content"><div className="adm-empty">Cargando…</div></div></>;

  return (
    <>
      <header className="adm-topbar"><div className="adm-topbar-left"><BackButton /><h1>Inicio</h1></div></header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        {sections.map((s, i) => (
          <div className="adm-card" key={s.section}>
            <h2>{LABELS[s.section] ?? s.section}</h2>
            {okKey === s.section && <div className="adm-alert adm-alert-ok">Sección guardada.</div>}
            {s.section === "hero" ? (
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <ImageUpload value={s.image_url} onChange={(url) => update(i, { image_url: url })} folder="home" label="Imagen 1" />
                <ImageUpload
                  value={s.extra?.image_secondary ?? null}
                  onChange={(url) => update(i, { extra: { ...(s.extra ?? {}), image_secondary: url } })}
                  folder="home"
                  label="Imagen 2 (se alterna con la primera)"
                />
              </div>
            ) : s.section === "formaciones" ? null : (
              <ImageUpload value={s.image_url} onChange={(url) => update(i, { image_url: url })} folder="home" label="Imagen" />
            )}
            <div className="adm-grid2">
              <div className="adm-field"><label className="adm-label">Eyebrow (etiqueta)</label><input className="adm-input" value={s.eyebrow ?? ""} onChange={(e) => update(i, { eyebrow: e.target.value })} /></div>
              <div className="adm-field"><label className="adm-label">Título</label><input className="adm-input" value={s.title ?? ""} onChange={(e) => update(i, { title: e.target.value })} /></div>
              {s.section !== "formaciones" && (
                <div className="adm-field"><label className="adm-label">Texto del botón (CTA)</label><input className="adm-input" value={s.cta_label ?? ""} onChange={(e) => update(i, { cta_label: e.target.value })} /></div>
              )}
            </div>
            {["academia", "formaciones", "online"].includes(s.section) && (
              <div className="adm-field"><label className="adm-label">Descripción / texto</label><textarea className="adm-textarea" value={s.body ?? ""} onChange={(e) => update(i, { body: e.target.value })} /></div>
            )}
            <button className="adm-btn adm-btn-primary" onClick={() => save(s)} disabled={savingKey === s.section}>{savingKey === s.section ? "Guardando…" : "Guardar sección"}</button>
          </div>
        ))}
      </div>
    </>
  );
}
