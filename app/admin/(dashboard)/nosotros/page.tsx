"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

type About = Record<string, string | null>;
type Contact = Record<string, string | null>;

export default function NosotrosAdminPage() {
  const supabase = createClient();
  const [about, setAbout] = useState<About>({});
  const [values, setValues] = useState<string[]>([]);
  const [contact, setContact] = useState<Contact>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  const load = useCallback(async () => {
    const [a, v, c] = await Promise.all([
      supabase.from("about_content").select("*").limit(1).maybeSingle(),
      supabase.from("about_values").select("label, sort_order").order("sort_order"),
      supabase.from("contact_settings").select("*").limit(1).maybeSingle(),
    ]);
    if (a.error || v.error || c.error) setError((a.error || v.error || c.error)!.message);
    setAbout((a.data as About) ?? {});
    setValues(((v.data as any[]) ?? []).map((x) => x.label));
    setContact((c.data as Contact) ?? {});
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true); setError(null); setOk(false);
    const aPayload = { ...about, singleton: true };
    delete (aPayload as any).created_at; delete (aPayload as any).updated_at;
    const cPayload = { ...contact, singleton: true };
    delete (cPayload as any).created_at; delete (cPayload as any).updated_at;

    const r1 = await supabase.from("about_content").upsert(aPayload, { onConflict: "singleton" });
    const r2 = await supabase.from("contact_settings").upsert(cPayload, { onConflict: "singleton" });
    // Reemplazar valores
    await supabase.from("about_values").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const clean = values.map((s) => s.trim()).filter(Boolean);
    const r3 = clean.length ? await supabase.from("about_values").insert(clean.map((label, i) => ({ label, sort_order: i }))) : { error: null };

    setSaving(false);
    const err = r1.error || r2.error || r3.error;
    if (err) { setError(err.message); return; }
    setOk(true); load();
  }

  const A = (k: string, v: string) => { setAbout((p) => ({ ...p, [k]: v })); setOk(false); };
  const C = (k: string, v: string) => { setContact((p) => ({ ...p, [k]: v })); setOk(false); };

  if (loading) return <><header className="adm-topbar"><h1>Nosotros</h1></header><div className="adm-content"><div className="adm-empty">Cargando…</div></div></>;

  return (
    <>
      <header className="adm-topbar">
        <h1>Nosotros</h1>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar todo"}</button>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        {ok && <div className="adm-alert adm-alert-ok">Cambios guardados.</div>}

        <div className="adm-card">
          <h2>Presentación</h2>
          <ImageUpload value={about.image_url ?? null} onChange={(url) => setAbout((p) => ({ ...p, image_url: url }))} folder="about" label="Imagen" />
          <div className="adm-field"><label className="adm-label">Título</label><input className="adm-input" value={about.title ?? ""} onChange={(e) => A("title", e.target.value)} /></div>
          <div className="adm-field"><label className="adm-label">Descripción principal</label><textarea className="adm-textarea" value={about.main_description ?? ""} onChange={(e) => A("main_description", e.target.value)} /></div>
        </div>

        <div className="adm-card">
          <h2>Visión y misión</h2>
          <div className="adm-field"><label className="adm-label">Visión</label><textarea className="adm-textarea" value={about.vision ?? ""} onChange={(e) => A("vision", e.target.value)} /></div>
          <div className="adm-field"><label className="adm-label">Misión</label><textarea className="adm-textarea" value={about.mission ?? ""} onChange={(e) => A("mission", e.target.value)} /></div>
        </div>

        <div className="adm-card">
          <h2>Valores</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {values.map((val, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <input className="adm-input" value={val} onChange={(e) => { const c = [...values]; c[i] = e.target.value; setValues(c); }} />
                <button type="button" className="adm-btn adm-btn-danger" style={{ minHeight: 44, padding: "0 12px" }} onClick={() => setValues(values.filter((_, k) => k !== i))}>✕</button>
              </div>
            ))}
            <button type="button" className="adm-btn adm-btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => setValues([...values, ""])}>+ Agregar valor</button>
          </div>
        </div>

        <div className="adm-card">
          <h2>Cita destacada</h2>
          <div className="adm-field"><label className="adm-label">Frase</label><textarea className="adm-textarea" value={about.quote ?? ""} onChange={(e) => A("quote", e.target.value)} /></div>
          <div className="adm-field"><label className="adm-label">Autor de la frase</label><input className="adm-input" value={about.quote_author ?? ""} onChange={(e) => A("quote_author", e.target.value)} /></div>
        </div>

        <div className="adm-card">
          <h2>Contacto y ubicación</h2>
          <div className="adm-grid2">
            <div className="adm-field"><label className="adm-label">Dirección</label><input className="adm-input" value={contact.address ?? ""} onChange={(e) => C("address", e.target.value)} /></div>
            <div className="adm-field"><label className="adm-label">Horario</label><input className="adm-input" value={contact.hours ?? ""} onChange={(e) => C("hours", e.target.value)} /></div>
            <div className="adm-field"><label className="adm-label">Teléfono</label><input className="adm-input" value={contact.phone ?? ""} onChange={(e) => C("phone", e.target.value)} /></div>
            <div className="adm-field"><label className="adm-label">WhatsApp (números)</label><input className="adm-input" value={contact.whatsapp ?? ""} onChange={(e) => C("whatsapp", e.target.value)} /></div>
            <div className="adm-field"><label className="adm-label">Email</label><input className="adm-input" value={contact.email ?? ""} onChange={(e) => C("email", e.target.value)} /></div>
            <div className="adm-field"><label className="adm-label">Google Maps (URL)</label><input className="adm-input" value={contact.maps_url ?? ""} onChange={(e) => C("maps_url", e.target.value)} /></div>
          </div>
          <div className="adm-field"><label className="adm-label">URL del mapa embebido (iframe)</label><input className="adm-input" value={contact.map_embed_url ?? ""} onChange={(e) => C("map_embed_url", e.target.value)} /></div>
        </div>

        <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar todo"}</button>
      </div>
    </>
  );
}
