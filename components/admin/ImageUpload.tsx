"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { safeFileName } from "@/lib/utils/slug";
import { compressToWebp } from "@/lib/utils/image";

const BUCKET = "charme-media";
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_MB = 25; // límite del archivo original (antes de comprimir)

export default function ImageUpload({
  value,
  onChange,
  folder = "misc",
  label = "Imagen",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    if (!ACCEPT.includes(file.type)) {
      setError("Formato no permitido. Usá JPG, PNG, WebP o AVIF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo supera los ${MAX_MB} MB. Usá una imagen más chica.`);
      return;
    }

    setUploading(true);
    try {
      // Comprime a WebP; si falla, sube el original.
      let data: Blob = file;
      let ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      let contentType = file.type;
      try {
        data = await compressToWebp(file);
        ext = "webp";
        contentType = "image/webp";
      } catch {
        /* usa el original */
      }

      const supabase = createClient();
      const path = `${folder}/${safeFileName(file.name).replace(/\.[a-z0-9]+$/i, "." + ext)}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, data, {
        cacheControl: "3600",
        upsert: false,
        contentType,
      });
      if (upErr) {
        setError(`No se pudo subir la imagen: ${upErr.message}`);
        return;
      }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(pub.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo procesar la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 120, height: 150, borderRadius: 10, overflow: "hidden", background: "var(--paper)", border: "1px solid var(--line)", flexShrink: 0 }}>
          {value ? (
            <Image src={value} alt="preview" fill sizes="120px" style={{ objectFit: "cover" }} unoptimized />
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--muted)", fontSize: 11 }}>Sin imagen</div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label className="adm-btn adm-btn-ghost" style={{ cursor: "pointer" }}>
            {uploading ? "Procesando…" : "Subir imagen"}
            <input type="file" accept={ACCEPT.join(",")} onChange={onFile} disabled={uploading} hidden />
          </label>
          {value && (
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => onChange(null)}>Quitar</button>
          )}
          <span style={{ fontSize: 11, color: "var(--muted)" }}>JPG, PNG, WebP o AVIF · se optimiza automáticamente</span>
        </div>
      </div>
      {error && <div className="adm-alert adm-alert-error" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}
