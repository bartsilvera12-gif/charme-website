"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { getSessionAdmin, type AdminProfile } from "@/lib/auth/admin-client";
import "../admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    getSessionAdmin()
      .then((res) => {
        if (!active) return;
        if (!res) { router.replace("/admin/login"); return; }
        setAdmin(res);
        setReady(true);
      })
      .catch(() => { if (active) router.replace("/admin/login"); });
    return () => { active = false; };
  }, [router]);

  if (!ready || !admin) {
    return (
      <div className="adm" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div className="adm-empty">Cargando…</div>
      </div>
    );
  }

  return (
    <div className="adm">
      <div className="adm-shell">
        <Sidebar adminName={admin.full_name ?? "Administrador"} />
        <div className="adm-main">{children}</div>
      </div>
    </div>
  );
}
