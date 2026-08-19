import { createClient } from "@supabase/supabase-js";

const SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? "charme";

/**
 * Cliente de sólo-lectura pública (anon key, sin sesión/cookies).
 * Para el contenido público del sitio. Al no usar cookies, permite
 * que las páginas se puedan cachear/revalidar (ISR).
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: SCHEMA },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
