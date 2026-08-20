"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeFileName } from "@/lib/utils/slug";

const BUCKET = "charme-media";

export default function FileUpload({
  value,
  onChange,
  folder = "files",
  accept = "application/pdf",
  label = "Archivo (PDF)",
  maxMb = 20,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  accept?: string;
  label?: string;
  maxMb?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    if (file.size > maxMb * 1024 * 1024) {
      setError(`El archivo supera los ${maxMb} MB.`);
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const path = `${folder}/${safeFileName(file.name)}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
    });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  const fileName = value ? decodeURIComponent(value.split("/").pop() || "archivo") : null;

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label className="adm-btn adm-btn-ghost" style={{ cursor: "pointer" }}>
          {uploading ? "Subiendo…" : value ? "Cambiar archivo" : "Subir archivo"}
          <input type="file" accept={accept} onChange={onFile} disabled={uploading} hidden />
        </label>
        {value && (
          <>
            <a href={value} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--gold)", textDecoration: "underline" }}>{fileName}</a>
            <button type="button" className="adm-btn adm-btn-ghost" style={{ minHeight: 36, padding: "0 12px" }} onClick={() => onChange(null)}>Quitar</button>
          </>
        )}
      </div>
      <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>PDF · máx {maxMb} MB</span>
      {error && <div className="adm-alert adm-alert-error" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}
