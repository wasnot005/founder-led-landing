'use client'

import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_APP_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_APP_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client = null;

if (!url || !key) {
  if (typeof window !== "undefined") {
    console.warn("Supabase credentials are not configured. Submissions will fail.");
  }
} else {
  client = createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export const supabase = client;
