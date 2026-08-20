"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  {
    title: "General",
    links: [{ href: "/admin", label: "Dashboard", icon: "◆", color: "#d8bd88" }],
  },
  {
    title: "Contenido",
    links: [
      { href: "/admin/inicio", label: "Inicio", icon: "⌂", color: "#e6a0ad" },
      { href: "/admin/formaciones", label: "Formaciones", icon: "✎", color: "#86a8d0" },
      { href: "/admin/categorias", label: "Categorías", icon: "▦", color: "#6fbcac" },
      { href: "/admin/galeria", label: "Galería", icon: "❖", color: "#ab8ec2" },
      { href: "/admin/nosotros", label: "Nosotros", icon: "✦", color: "#e0a06e" },
    ],
  },
  {
    title: "Campus",
    links: [
      { href: "/admin/alumnos", label: "Alumnos", icon: "🎓", color: "#7bb0a0" },
    ],
  },
  {
    title: "Sistema",
    links: [
      { href: "/admin/configuracion", label: "Configuración", icon: "⚙", color: "#9fb0c0" },
    ],
  },
];

export default function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <button className="adm-btn adm-btn-ghost adm-menu-btn" onClick={() => setOpen(true)} aria-label="Abrir menú">☰</button>
      {open && <div className="adm-backdrop" onClick={() => setOpen(false)} />}
      <aside className={`adm-sidebar ${open ? "open" : ""}`}>
        <div className="adm-sidebar-brand">CH<span>A</span>RME</div>
        {NAV.map((group) => (
          <div className="adm-navgroup" key={group.title}>
            <div className="adm-navgroup-title">{group.title}</div>
            {group.links.map((l) => (
              <button
                key={l.href}
                type="button"
                className={`adm-navlink ${isActive(l.href) ? "active" : ""}`}
                style={{ ["--nav-color" as string]: l.color } as React.CSSProperties}
                onClick={() => { setOpen(false); router.push(l.href); }}
              >
                <span className="adm-ico" aria-hidden="true">{l.icon}</span>
                {l.label}
              </button>
            ))}
          </div>
        ))}
        <div className="adm-sidebar-foot">
          <div style={{ padding: "0 10px 12px", fontSize: 12, color: "#b8b0a4" }}>{adminName}</div>
          <button className="adm-btn adm-btn-block adm-logout" onClick={logout} disabled={loggingOut}>
            {loggingOut ? "Saliendo…" : "Cerrar sesión"}
          </button>
        </div>
      </aside>
    </>
  );
}
