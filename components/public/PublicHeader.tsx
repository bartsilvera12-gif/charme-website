"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";

/** Header para páginas internas (Galería, Nosotros, Cursos) con menú hamburguesa en móvil. */
export default function PublicHeader({ active }: { active?: "nosotros" | "galeria" }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="site-header nosotros-header">
        <Link href="/" className="brand" aria-label="Academia CHARME">
          <NextImage src="/images/logo.png" alt="Academia CHARME" width={200} height={110} unoptimized />
        </Link>
        <nav className="desktop-nav">
          <Link href="/#formaciones">Formaciones</Link>
          <Link href="/#academia">Academia</Link>
          <Link href="/nosotros" className={active === "nosotros" ? "active" : undefined}>Nosotros</Link>
          <Link href="/#profesionales">Profesionales</Link>
          <Link href="/galeria" className={active === "galeria" ? "active" : undefined}>Galería</Link>
        </nav>
        <div className="header-actions">
          <Link className="button button-dark" href="/">Volver al inicio</Link>
          <button className="menu-button" onClick={() => setOpen(true)} aria-label="Abrir menú">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-top">
          <NextImage src="/images/logo.png" alt="Academia CHARME" width={260} height={140} unoptimized />
          <button onClick={close} aria-label="Cerrar menú">×</button>
        </div>
        <nav>
          <Link onClick={close} href="/#formaciones">Formaciones</Link>
          <Link onClick={close} href="/#academia">Academia</Link>
          <Link onClick={close} href="/nosotros">Nosotros</Link>
          <Link onClick={close} href="/#profesionales">Profesionales</Link>
          <Link onClick={close} href="/galeria">Galería</Link>
          <Link onClick={close} href="/">Volver al inicio</Link>
        </nav>
      </div>
    </>
  );
}
