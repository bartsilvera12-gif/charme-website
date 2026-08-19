"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { safeFileName } from "@/lib/utils/slug";
import { compressToWebp } from "@/lib/utils/image";
import BackButton from "@/components/admin/BackButton";

const BUCKET = "charme-media";
const IMG = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const VID = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMG = 25 * 1024 * 1024;
const MAX_VID = 60 * 1024 * 1024;

type Item = {
  id: string; type: "image" | "video"; media_url: string; title: string | null;
  description: string | null; alt_text: string | null; category: string | null;
  is_active: boolean; sort_order: number;
};

export default function GaleriaAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_items").select("*").order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setItems((data as Item[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError(null);
    let order = items.length;
    for (const file of files) {
      const isImg = IMG.includes(file.type);
      const isVid = VID.includes(file.type);
      if (!isImg && !isVid) { setError(`Formato no permitido: ${file.name}`); continue; }
      if (isImg && file.size > MAX_IMG) { setError(`${file.name}: imagen supera 25 MB`); continue; }
      if (isVid && file.size > MAX_VID) { setError(`${file.name}: video supera 60 MB`); continue; }
      setUploading(file.name);

      // Imágenes: comprimir a WebP en el navegador. Videos: subir tal cual.
      let data: Blob = file;
      let ext = (file.name.split(".").pop() || "bin").toLowerCase();
      let contentType = file.type;
      if (isImg) {
        try { data = await compressToWebp(file); ext = "webp"; contentType = "image/webp"; } catch { /* usa original */ }
      }
      const path = `gallery/${safeFileName(file.name).replace(/\.[a-z0-9]+$/i, "." + ext)}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, data, { cacheControl: "3600", contentType });
      if (upErr) { setError(`${file.name}: ${upErr.message}`); continue; }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const { error: insErr } = await supabase.from("gallery_items").insert({
        type: isVid ? "video" : "image", media_url: pub.publicUrl,
        alt_text: file.name.replace(/\.[^.]+$/, ""), sort_order: order++,
      });
      if (insErr) setError(insErr.message);
    }
    setUploading(null);
    load();
  }

  async function toggle(it: Item) {
    await supabase.from("gallery_items").update({ is_active: !it.is_active }).eq("id", it.id);
    load();
  }
  async function move(it: Item, dir: number) {
    const idx = items.findIndex((x) => x.id === it.id);
    const other = items[idx + dir];
    if (!other) return;
    await Promise.all([
      supabase.from("gallery_items").update({ sort_order: other.sort_order }).eq("id", it.id),
      supabase.from("gallery_items").update({ sort_order: it.sort_order }).eq("id", other.id),
    ]);
    load();
  }
  async function remove(it: Item) {
    if (!confirm("¿Eliminar este elemento de la galería?")) return;
    // Borra también el archivo del storage si es del bucket
    const marker = `/${BUCKET}/`;
    if (it.media_url.includes(marker)) {
      const path = decodeURIComponent(it.media_url.split(marker)[1] ?? "");
      if (path) await supabase.storage.from(BUCKET).remove([path]);
    }
    const { error } = await supabase.from("gallery_items").delete().eq("id", it.id);
    if (error) setError(error.message);
    else load();
  }
  async function saveMeta() {
    if (!editing) return;
    const { error } = await supabase.from("gallery_items").update({
      title: editing.title || null, description: editing.description || null,
      alt_text: editing.alt_text || null, category: editing.category || null,
    }).eq("id", editing.id);
    if (error) { setError(error.message); return; }
    setEditing(null);
    load();
  }

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-left"><BackButton /><h1>Galería</h1></div>
        <label className="adm-btn adm-btn-primary" style={{ cursor: "pointer" }}>
          {uploading ? `Subiendo ${uploading}…` : "+ Subir imágenes / videos"}
          <input type="file" multiple hidden accept={[...IMG, ...VID].join(",")} onChange={onFiles} disabled={!!uploading} />
        </label>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}

        {editing && (
          <div className="adm-card">
            <h2>Editar datos del elemento</h2>
            <div className="adm-field"><label className="adm-label">Título</label><input className="adm-input" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div className="adm-field"><label className="adm-label">Texto alternativo (alt)</label><input className="adm-input" value={editing.alt_text ?? ""} onChange={(e) => setEditing({ ...editing, alt_text: e.target.value })} /></div>
            <div className="adm-field"><label className="adm-label">Categoría</label><input className="adm-input" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Ej: Colorimetría" /></div>
            <div className="adm-field"><label className="adm-label">Descripción</label><textarea className="adm-textarea" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="adm-btn adm-btn-primary" onClick={saveMeta}>Guardar</button>
              <button className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="adm-card">
          {loading ? <div className="adm-empty">Cargando…</div>
          : items.length === 0 ? <div className="adm-empty"><h3>Galería vacía</h3><p>Subí imágenes o videos con el botón de arriba.</p></div>
          : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {items.map((it) => (
                <div key={it.id} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "#fff", opacity: it.is_active ? 1 : 0.5 }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", background: "#d8d0c5" }}>
                    {it.type === "video"
                      ? <video src={it.media_url} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <Image src={it.media_url} alt={it.alt_text ?? ""} fill sizes="160px" style={{ objectFit: "cover" }} unoptimized />}
                    <span className="adm-badge" style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,.6)", color: "#fff" }}>{it.type === "video" ? "Video" : "Imagen"}</span>
                  </div>
                  <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title || it.alt_text || "—"}</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px", fontSize: 11 }} onClick={() => move(it, -1)}>↑</button>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px", fontSize: 11 }} onClick={() => move(it, 1)}>↓</button>
                      <button className="adm-btn adm-btn-ghost" style={{ minHeight: 28, padding: "0 8px", fontSize: 11 }} onClick={() => toggle(it)}>{it.is_active ? "Ocultar" : "Mostrar"}</button>
                      <button className="adm-btn adm-btn-danger" style={{ minHeight: 28, padding: "0 8px", fontSize: 11 }} onClick={() => remove(it)}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
