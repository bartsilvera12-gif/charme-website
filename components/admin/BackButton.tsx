"use client";

import { useRouter } from "next/navigation";

/** Botón "Volver atrás" para el panel (vuelve a la página anterior). */
export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="adm-btn adm-btn-ghost adm-back"
      onClick={() => router.back()}
      aria-label="Volver atrás"
    >
      ← Volver
    </button>
  );
}
