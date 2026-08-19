import { createClient } from "@/lib/supabase/client";

export type AdminProfile = {
  id: string;
  full_name: string | null;
  role: "superadmin" | "admin" | "editor";
  is_active: boolean;
};

/**
 * Verifica del lado del cliente si hay una sesión de admin activa.
 * Devuelve el perfil (charme.admin_users) o null. La seguridad real la
 * garantiza RLS en Supabase; esto es sólo para la UX del panel.
 */
export async function getSessionAdmin(): Promise<AdminProfile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data || !data.is_active) return null;
  return data as AdminProfile;
}
