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

/**
 * Fetches the user's profile from the profiles table using their auth user ID.
 * Returns the profile data or null if not found.
 */
export async function fetchUserProfile(authId: string): Promise<{ full_name: string; business_name: string; email: string } | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, business_name, email")
      .eq("auth_id", authId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      full_name: data.full_name,
      business_name: data.business_name,
      email: data.email,
    };
  } catch {
    return null;
  }
}

/**
 * Updates the user's profile in the profiles table.
 * Returns success/error result for UI consumption.
 */
export async function updateUserProfile(
  authId: string,
  data: { full_name?: string; business_name?: string; email?: string }
): Promise<AuthResult> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("auth_id", authId);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update profile. Please try again.",
      };
    }

    return {
      success: true,
      user: {
        email: data.email || "",
        name: data.full_name,
      },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
