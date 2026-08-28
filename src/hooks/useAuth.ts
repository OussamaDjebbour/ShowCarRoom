import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

/**
 * useAuth — session state for the admin area.
 *
 * The owner is the only authenticated account (created manually in the
 * Supabase dashboard). This hook exposes the current session/user and
 * signIn/signOut helpers, and keeps state in sync with Supabase's
 * onAuthStateChange.
 *
 * onAuthStateChange runs its callback synchronously; any async work inside
 * it is wrapped in an IIFE to avoid deadlocking the event processing.
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  React.useEffect(() => {
    // Get the initial session once.
    supabase.auth.getSession().then(({ data }) => {
      setState({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
      });
    });

    // Subscribe to auth changes. Async work wrapped in an IIFE to avoid
    // deadlocking the synchronous onAuthStateChange callback.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setState({ session, user: session?.user ?? null, loading: false });
      })();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { ...state, signIn, signOut };
}
