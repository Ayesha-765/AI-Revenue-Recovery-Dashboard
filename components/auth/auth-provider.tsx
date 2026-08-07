"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/client";
import { signUpWithProfile, signInWithEmail, type AuthResult } from "@/lib/supabase/auth";

export interface User {
  email: string;
  name?: string;
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: { name: string; businessName: string; email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data.session?.user) {
          setUser({
            email: data.session.user.email || "",
          });
        }
      } catch {
        // ignore
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email || "",
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = React.useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = React.useCallback(async (data: { name: string; businessName: string; email: string; password: string }): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await signUpWithProfile(data);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
