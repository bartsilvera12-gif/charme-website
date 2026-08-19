"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type S = Record<string, string | null> & { id?: string };

const FIELDS: { key: string; label: string; placeholder?: string }[] = [
  { key: "site_name", label: "Nombre del sitio" },
  { key: "whatsapp", label: "WhatsApp (solo números)", placeholder: "595986373130" },
  { key: "phone", label: "Teléfono", placeholder: "+595 (986) 373 130" },
  { key: "email", label: "Email" },
  { key: "address", label: "Dirección" },
  { key: "instagram", label: "Instagram (URL)" },
  { key: "facebook", label: "Facebook (URL)" },
  { key: "tiktok", label: "TikTok (URL)" },
  { key: "neura_url", label: "URL de Neura" },
  { key: "copyright", label: "Texto de copyright" },
];

export default function ConfiguracionPage() {
  const supabase = createClient();
  const [s, setS] = useState<S>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (error) setError(error.message); else setS((data as S) ?? {});
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: string | null) => { setS((p) => ({ ...p, [k]: v })); setOk(false); };

  async function save() {
    setSaving(true); setError(null); setOk(false);
    const payload = { ...s, singleton: true };
    delete (payload as any).created_at; delete (payload as any).updated_at;
    const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "singleton" });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setOk(true); load();
  }

  if (loading) return <><header className="adm-topbar"><h1>Configuración</h1></header><div className="adm-content"><div className="adm-empty">Cargando…</div></div></>;

  return (
    <>
      <header className="adm-topbar">
        <h1>Configuración general</h1>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}
        {ok && <div className="adm-alert adm-alert-ok">Cambios guardados.</div>}
        <div className="adm-card">
          <h2>Datos y contacto</h2>
          <div className="adm-grid2">
            {FIELDS.map((f) => (
              <div className="adm-field" key={f.key}>
                <label className="adm-label">{f.label}</label>
                <input className="adm-input" value={s[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="adm-field"><label className="adm-label">Texto de condiciones de pago</label><textarea className="adm-textarea" value={s.payment_terms ?? ""} onChange={(e) => set("payment_terms", e.target.value)} /></div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
      </div>
    </>
  );
}
