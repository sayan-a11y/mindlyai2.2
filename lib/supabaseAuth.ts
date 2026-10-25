import { supabase } from './supabaseClient';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * Signs in user with email & password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error,
  };
}

/**
 * Creates a new account with email & password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName?.trim() || email.split('@')[0],
      },
    },
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    error,
  };
}

/**
 * Signs out the current user session
 */
export async function signOutUser(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Retrieves the currently cached session from localStorage
 */
export async function getCachedSession(): Promise<{ user: User | null; session: Session | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      user: session?.user || null,
      session: session || null,
    };
  } catch (err) {
    return { user: null, session: null };
  }
}

/**
 * Subscribes to real-time authentication changes (login, logout, token refresh)
 */
export function onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null, session || null);
  });

  return subscription;
}
