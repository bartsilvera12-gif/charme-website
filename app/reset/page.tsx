"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (pw !== confirm) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setOk(true);
    setTimeout(() => router.replace("/panel"), 1600);
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(130% 110% at 0% 0%, #efe6d4 0%, var(--paper) 52%, #f7efe0 100%)" }}>
      <div className="login-modal" style={{ width: "min(440px, 100%)", background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "44px 38px", boxShadow: "0 30px 70px rgba(24,22,19,.12)", margin: 0 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image src="/images/logo.png" alt="Academia CHARME" width={138} height={76} unoptimized style={{ filter: "invert(1)" }} />
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 28, textAlign: "center", margin: "0 0 20px", letterSpacing: "-.02em" }}>Nueva contraseña</h1>

        {ok ? (
          <div className="auth-ok" style={{ textAlign: "center" }}>¡Contraseña actualizada! Redirigiéndote a tu campus…</div>
        ) : !ready ? (
          <>
            <div className="auth-error">Este enlace no es válido o ya expiró.</div>
            <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
              Volvé a <Link href="/" style={{ color: "var(--champagne)" }}>Academia CHARME</Link> y pedí un nuevo enlace desde “Iniciar sesión → ¿Olvidaste tu contraseña?”.
            </p>
          </>
        ) : (
          <form onSubmit={submit}>
            {error && <div className="auth-error">{error}</div>}
            <label>Nueva contraseña
              <div className="pw-wrap">
                <input type={show ? "text" : "password"} value={pw} minLength={8} required onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
                <button type="button" className="pw-toggle" onClick={() => setShow(!show)}>{show ? "Ocultar" : "Ver"}</button>
              </div>
            </label>
            <label>Confirmar contraseña
              <div className="pw-wrap">
                <input type={show ? "text" : "password"} value={confirm} minLength={8} required onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
              </div>
            </label>
            <button className="button button-dark" type="submit" disabled={loading} style={{ width: "100%", marginTop: 6 }}>
              {loading ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
