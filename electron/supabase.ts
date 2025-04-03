// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { store } from "./store";

import type { Session } from "@supabase/supabase-js";

const electronStoreAdapter = {
  // TODO fix this shit and then test auth with new handlers and store
  getItem(key: string) {
    const val = store.get(key);
    return typeof val === "string" ? val : null;
  },
  setItem(key: string, value: string) {
    store.set(key, value);
  },
  removeItem(key: string) {
    store.delete(key);
  },
};

const SUPABASE_URL = "https://ygcoeiqqtekdcstyaidi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY29laXFxdGVrZGNzdHlhaWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTUzODUsImV4cCI6MjA1OTAzMTM4NX0.cjr07w6e0fjfRRYZVMdznXO1Q0i1nu-RR4zAx7vwyjA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: electronStoreAdapter
  },
});
