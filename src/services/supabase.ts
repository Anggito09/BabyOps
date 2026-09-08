import { Platform } from 'react-native';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase client — HANYA aktif di APK native (Android/iOS).
 * Di web/Vercel SELALU null -> app otomatis pakai AsyncStorage lokal.
 *
 * Konfigurasi: isi EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
 * via `eas secret:create` (jangan hardcode di repo).
 * Tanpa kedua env ini -> cloud nonaktif, fallback lokal (aman untuk dev/web).
 */

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? (extra.supabaseUrl as string | undefined) ?? '';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (extra.supabaseAnonKey as string | undefined) ?? '';

export const isCloudEnabled =
  Platform.OS !== 'web' && SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isCloudEnabled) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // AsyncStorage sudah dipakai DB lokal; biarkan default (aman di native).
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}
