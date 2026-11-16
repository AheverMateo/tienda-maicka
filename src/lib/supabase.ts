import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase no está configurado. Verificá las variables en .env.local"
    );
  }
  return createClient(supabaseUrl!, supabaseAnonKey!);
}