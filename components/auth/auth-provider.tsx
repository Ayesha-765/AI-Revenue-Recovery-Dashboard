"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/client";
import { signUpWithProfile, signInWithEmail, fetchUserProfile, updateUserProfile, type AuthResult } from "@/lib/supabase/auth";

export interface User {
  email: string;
  name?: string;
  businessName?: string;
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: { name: string; businessName: string; email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (data: { full_name?: string; business_name?: string; email?: string }) => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadUserProfile = React.useCallback(async (userId: string, email: string) => {
    const profile = await fetchUserProfile(userId);
    console.log("AuthProvider loadUserProfile", { userId, email, profile });
    if (profile) {
      setUser({
        email: profile.email || email,
        name: profile.full_name,
        businessName: profile.business_name,
      });
    } else {
      setUser({ email });
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data.session?.user) {
          await loadUserProfile(data.session.user.id, data.session.user.email || "");
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
          loadUserProfile(session.user.id, session.user.email || "");
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
  }, [loadUserProfile]);

  const login = React.useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (sessionUser) {
          await loadUserProfile(sessionUser.id, sessionUser.email || "");
        }
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile]);

  const register = React.useCallback(async (data: { name: string; businessName: string; email: string; password: string }): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await signUpWithProfile(data);
      if (result.success) {
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUser = sessionData.session?.user;
        if (sessionUser) {
          await loadUserProfile(sessionUser.id, sessionUser.email || data.email);
        }
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile]);

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

  const updateProfile = React.useCallback(async (profileData: { full_name?: string; business_name?: string; email?: string }): Promise<AuthResult> => {
    const currentUser = await supabase.auth.getUser();
    const userId = currentUser.data.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to update your profile.",
      };
    }

    setIsLoading(true);
    try {
      const result = await updateUserProfile(userId, profileData);
      if (result.success) {
        await loadUserProfile(userId, user?.email || "");
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile, user?.email]);

  const refreshUser = React.useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const sessionUser = data.user;
    if (sessionUser) {
      await loadUserProfile(sessionUser.id, sessionUser.email || "");
    }
  }, [loadUserProfile]);

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, isLoading, login, register, logout, updateProfile, refreshUser]
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
