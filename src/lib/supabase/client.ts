import { createBrowserClient } from "@supabase/ssr";

function isValidUrl(urlStr?: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabaseUrl = isValidUrl(rawUrl) ? rawUrl! : "https://placeholder.supabase.co";
  const supabaseAnonKey = rawKey || "placeholder-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
