
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthChangeEvent,
  Session,
  User,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  registerHydrationCallback,
  registerSessionHandler,
  notifySessionChanged,
} from "@/lib/storeAuthBridge";
import { handleTaskSessionChange } from "@/lib/supabase/taskSession";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const supabase = createClient();
  let active = true;
  let hydrationReady = false;
  let pendingUserId: string | null = null;
  let hasPendingSession = false;

  const processSession = async (userId: string | null) => {
    if (!active) return;

    if (!hydrationReady) {
      pendingUserId = userId;
      hasPendingSession = true;
      return;
    }

    try {
      await notifySessionChanged(userId);
    } catch (error) {
      console.error("Failed to process auth session:", error);
    }
  };

registerSessionHandler(handleTaskSessionChange);

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event: AuthChangeEvent, nextSession: Session | null) => {
      if (!active) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      const nextUserId = nextSession?.user.id ?? null;

      if (!hydrationReady) {
        pendingUserId = nextUserId;
        hasPendingSession = true;
        return;
      }

      void processSession(nextUserId);
    },
  );

  registerHydrationCallback((success) => {
    if (!active) return;

    hydrationReady = success;

    if (!success) {
      console.error(
        "Taskly: session synchronization is waiting because local data could not be hydrated.",
      );
      return;
    }

    if (hasPendingSession) {
      const userId = pendingUserId;
      hasPendingSession = false;
      void processSession(userId);
    }
  });

  void supabase.auth
    .getSession()
    .then(
  (result: Awaited<ReturnType<typeof supabase.auth.getSession>>) => {
    const { data, error } = result;
      if (!active) return;

      if (error) {
        console.error("Failed to get auth session:", error.message);
        setSession(null);
        setUser(null);
        setLoading(false);
        void processSession(null);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      void processSession(data.session?.user.id ?? null);
    })
    .catch((error: unknown) => {
      if (!active) return;

      console.error("Failed to initialize auth:", error);
      setSession(null);
      setUser(null);
      setLoading(false);
      void processSession(null);
    });

  return () => {
    active = false;
    subscription.unsubscribe();
  };
}, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/?from=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }

  return context;
}
