"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CampusHeader({ studentName }: { studentName: string }) {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
  }
  return (
    <header className="site-header nosotros-header">
      <Link href="/" className="brand" aria-label="Academia CHARME">
        <NextImage src="/images/logo.png" alt="Academia CHARME" width={200} height={110} unoptimized />
      </Link>
      <nav className="desktop-nav">
        <Link href="/">Inicio</Link>
        <Link href="/panel" className="active">Mi campus</Link>
        <Link href="/#formaciones">Formaciones</Link>
      </nav>
      <div className="header-actions" style={{ gap: 16 }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{studentName}</span>
        <button className="button button-dark" onClick={logout}>Salir</button>
      </div>
    </header>
  );
}
