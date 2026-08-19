"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    // Verificar que el usuario sea un admin activo antes de entrar
    const { data: admin } = await supabase
      .from("admin_users")
      .select("id, is_active")
      .eq("id", data.user!.id)
      .maybeSingle();

    if (!admin || !admin.is_active) {
      await supabase.auth.signOut();
      setError("Esta cuenta no tiene acceso de administrador.");
      setLoading(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <div className="adm-alert adm-alert-error">{error}</div>}
      <div className="adm-field">
        <label className="adm-label" htmlFor="email">Correo</label>
        <input
          id="email" type="email" className="adm-input" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} required
          placeholder="admin@charme.com"
        />
      </div>
      <div className="adm-field">
        <label className="adm-label" htmlFor="password">Contraseña</label>
        <input
          id="password" type="password" className="adm-input" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
      </div>
      <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={loading}>
        {loading ? <span className="adm-spinner" /> : "Ingresar"}
      </button>
    </form>
  );
}
