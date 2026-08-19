"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth/admin-client";
import LoginForm from "@/components/admin/LoginForm";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    getSessionAdmin()
      .then((admin) => {
        if (!active) return;
        if (admin) { router.replace("/admin"); return; }
        setChecking(false);
      })
      .catch(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [router]);

  if (checking) {
    return (
      <main className="adm-login-wrap">
        <div className="adm-empty">Cargando…</div>
      </main>
    );
  }

  return (
    <main className="adm-login-wrap">
      <div className="adm-login">
        <div className="adm-login-brand">
          <Image src="/images/logo.png" alt="Academia CHARME" width={132} height={72} unoptimized />
        </div>
        <h1>Panel de administración</h1>
        <p className="sub">Acceso exclusivo del equipo CHARME</p>
        <LoginForm redirectTo="/admin" />
      </div>
    </main>
  );
}
