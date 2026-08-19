import { createBrowserClient } from "@supabase/ssr";

const SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? "charme";

/**
 * Cliente de Supabase para el navegador (Client Components).
 * Usa la anon key (pública, protegida por RLS) y opera por defecto
 * sobre el schema `charme`.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: SCHEMA } },
  );
}
