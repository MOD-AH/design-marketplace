"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { syncUserProfile } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { usePostHog } from "@/lib/posthog";
import type { ProfileRow } from "@/types/database";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  // Re-fetches the Supabase profile; call after the user updates their profile.
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const posthog = usePostHog();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (firebaseUid: string): Promise<ProfileRow | null> => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("firebase_uid", firebaseUid)
      .single();
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.uid);
    setState((prev) => ({ ...prev, profile }));
  }, [state.user, fetchProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Persist a session cookie so middleware can gate server-rendered routes.
        const idToken = await firebaseUser.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        // 2. Create the Supabase profile row on first sign-in (no-op afterwards).
        await syncUserProfile(firebaseUser);

        // 3. Fetch the full profile row for use throughout the app.
        const profile = await fetchProfile(firebaseUser.uid);

        // Identify the user in PostHog with their Supabase profile ID and properties.
        if (profile) {
          const accountAgeDays = Math.floor(
            (Date.now() - new Date(profile.created_at).getTime()) / 86_400_000
          );
          posthog.identify(profile.id, {
            email: profile.email,
            is_seller: profile.is_seller,
            account_age_days: accountAgeDays,
          });
        }

        setState({ user: firebaseUser, profile, loading: false });
      } else {
        // Clear the session cookie so middleware stops granting access.
        await fetch("/api/auth/session", { method: "DELETE" });
        posthog.reset();
        setState({ user: null, profile: null, loading: false });
      }
    });

    return unsubscribe;
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ ...state, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
