import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

// Alias for the Insert type the Supabase client actually expects (includes & Record<string,unknown>).
type DbProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

// ─── Providers ───────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();
// Always show the account picker, even when one account is already signed in.
googleProvider.setCustomParameters({ prompt: "select_account" });

// ─── Sign-in ─────────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<User> {
  const result: UserCredential = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// ─── Sign-out ────────────────────────────────────────────────────────────────

// Signs the user out of Firebase. AuthProvider's onAuthStateChanged listener
// detects the change and clears the session cookie automatically.
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ─── Current user ────────────────────────────────────────────────────────────

// Returns the currently signed-in Firebase user synchronously, or null.
// Prefer the `useAuth()` hook in React components for reactive updates.
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// ─── Supabase profile sync ───────────────────────────────────────────────────

// Creates a Supabase `profiles` row for a Firebase user on their first sign-in.
// Safe to call on every sign-in — uses upsert with ignoreDuplicates so it is
// a true no-op when the profile already exists.
export async function syncUserProfile(user: User): Promise<void> {
  // Type the object literal as DbProfileInsert (= ProfileInsert & Record<string, unknown>)
  // so TypeScript's object-literal assignment rules apply and the upsert call type-checks.
  const profile: DbProfileInsert = {
    firebase_uid: user.uid,
    email: user.email ?? "",
    full_name: user.displayName ?? null,
    avatar_url: user.photoURL ?? null,
  };

  const { error } = await supabase
    .from("profiles")
    .upsert([profile], {
      onConflict: "firebase_uid",
      ignoreDuplicates: true,   // never overwrite user-edited data on re-login
    });

  if (error) {
    console.error("syncUserProfile error:", error.message);
    throw new Error(`Profile sync failed: ${error.message}`);
  }
}
