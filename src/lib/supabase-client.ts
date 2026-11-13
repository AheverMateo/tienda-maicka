"use client";

import { createClient } from "@supabase/supabase-js";

// Estos valores deben configurarse en las variables de entorno
// y reemplazar los placeholders con los valores reales del proyecto Supabase

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);