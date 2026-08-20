"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function StudentAuthModal({
  open,
  onClose,
  initialMode = "login",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState<string | null>(null);

  useEffect(() => { setMode(initialMode); }, [initialMode, open]);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setSessionName((data.user.user_metadata?.full_name as string) || data.user.email || "alumna/o");
    } else {
      setSessionName(null);
    }
  }, [supabase]);

  useEffect(() => { if (open) checkSession(); }, [open, checkSession]);

  function reset() {
    setError(null); setOk(null); setPassword(""); setConfirm("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setOk(null);

    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (mode === "register" && password !== confirm) { setError("Las contraseñas no coinciden."); return; }

    setLoading(true);
    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      setLoading(false);
      if (error) {
        setError(error.message.includes("already registered") ? "Ese email ya tiene una cuenta." : error.message);
        return;
      }
      if (data.session) {
        setSessionName(name.trim() || email);
        setOk("¡Cuenta creada! Ya iniciaste sesión.");
      } else {
        setOk("¡Cuenta creada! Revisá tu correo para confirmar la cuenta y después iniciá sesión.");
        setMode("login");
      }
      setPassword(""); setConfirm("");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (error) {
        setError(error.message.includes("Invalid login") ? "Correo o contraseña incorrectos." : error.message);
        return;
      }
      setSessionName((data.user.user_metadata?.full_name as string) || data.user.email || "alumna/o");
      setOk("¡Sesión iniciada!");
      setPassword("");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setSessionName(null);
    setOk(null);
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true"
      aria-label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-modal">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <Image src="/images/logo.png" alt="Academia CHARME" width={240} height={130} unoptimized />

        {sessionName ? (
          <>
            <p className="eyebrow">Área del alumno</p>
            <h2 style={{ fontSize: 30, margin: "10px 0 4px" }}>¡Hola!</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", overflowWrap: "anywhere", wordBreak: "break-word" }}>{sessionName}</p>
            {ok && <div className="auth-ok">{ok}</div>}
            <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>
              Ya tenés tu sesión iniciada. Entrá a tu campus para ver tus cursos.
            </p>
            <a className="button button-dark" href="/panel" style={{ width: "100%", boxSizing: "border-box" }}>Ir a mi campus →</a>
            <div className="auth-switch">
              <button type="button" onClick={logout}>Cerrar sesión</button>
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">{mode === "login" ? "Área del alumno" : "Nueva alumna/o"}</p>
            <h2>{mode === "login" ? "Continuá aprendiendo." : "Empezá tu formación."}</h2>

            {error && <div className="auth-error">{error}</div>}
            {ok && <div className="auth-ok">{ok}</div>}

            <form onSubmit={onSubmit}>
              {mode === "register" && (
                <label>Nombre completo
                  <input type="text" placeholder="Tu nombre y apellido" autoComplete="name" required
                    value={name} onChange={(e) => setName(e.target.value)} />
                </label>
              )}
              <label>Email
                <input type="email" placeholder="tu@email.com" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>Contraseña
                <div className="pw-wrap">
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" minLength={8} required
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? "Ocultar contraseña" : "Ver contraseña"}>
                    {showPw ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </label>
              {mode === "register" && (
                <label>Confirmar contraseña
                  <div className="pw-wrap">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" minLength={8} required
                      autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  </div>
                </label>
              )}
              <button className="button button-dark" type="submit" disabled={loading}>
                {loading ? "Procesando…" : mode === "login" ? "Iniciar sesión" : "Crear mi cuenta"}
              </button>
            </form>

            <div className="auth-switch">
              <span>{mode === "login" ? "¿Todavía no tenés cuenta?" : "¿Ya tenés una cuenta?"}</span>
              <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); reset(); }}>
                {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
