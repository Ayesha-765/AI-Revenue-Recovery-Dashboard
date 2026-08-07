import { supabase } from "./client";

export interface SignUpData {
  name: string;
  businessName: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: { email: string; name?: string };
}

/**
 * Creates a new user in Supabase Auth and inserts a profile record.
 * Returns success/error result for UI consumption.
 */
export async function signUpWithProfile(data: SignUpData): Promise<AuthResult> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return {
        success: false,
        error: authError.message || "Failed to create account. Please try again.",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create account. Please try again.",
      };
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      auth_id: authData.user.id,
      full_name: data.name,
      business_name: data.businessName,
      email: data.email,
    });

    if (profileError) {
      return {
        success: false,
        error: `Profile setup failed: ${profileError.message || "Please contact support."}`,
      };
    }

    return {
      success: true,
      user: {
        email: data.email,
        name: data.name,
      },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Signs in a user with email and password.
 * Returns success/error result for UI consumption.
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Invalid email or password. Please try again.",
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      };
    }

    return {
      success: true,
      user: {
        email: data.user.email || email,
      },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
