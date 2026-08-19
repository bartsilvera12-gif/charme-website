/** Convierte un texto a slug seguro (a-z0-9 con guiones). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Nombre de archivo único y seguro para Storage. */
export function safeFileName(original: string): string {
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  const base = slugify(dot >= 0 ? original.slice(0, dot) : original).slice(0, 40) || "file";
  const rand = Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  return `${base}-${rand}.${ext}`;
}
