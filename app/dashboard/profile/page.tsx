"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/components/auth/auth-provider";
import { fetchUserProfile, updateUserProfile, updateUserPassword, deleteUserAccount } from "@/lib/supabase/auth";
import { Loader2, User, Lock, Trash2 } from "lucide-react";

type FormData = {
  full_name: string;
  business_name: string;
  email: string;
};

type PasswordData = {
  new_password: string;
  confirm_password: string;
};

const emptyProfileForm: FormData = {
  full_name: "",
  business_name: "",
  email: "",
};

const emptyPasswordForm: PasswordData = {
  new_password: "",
  confirm_password: "",
};

function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();
  const [profileForm, setProfileForm] = React.useState<FormData>(emptyProfileForm);
  const [passwordForm, setPasswordForm] = React.useState<PasswordData>(emptyPasswordForm);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const { data: sessionData } = await (await import("@/lib/supabase/client")).supabase.auth.getUser();
        const sessionUser = sessionData.user;
        console.log("Profile page sessionUser", sessionUser?.id, sessionUser?.email);

        if (!sessionUser || !mounted) return;

        const profile = await fetchUserProfile(sessionUser.id);
        console.log("Profile page fetchUserProfile result", profile);

        if (mounted && profile) {
          setProfileForm({
            full_name: profile.full_name,
            business_name: profile.business_name,
            email: profile.email,
          });
        } else if (mounted) {
          setProfileForm({
            full_name: user?.name || "",
            business_name: user?.businessName || "",
            email: user?.email || sessionUser.email || "",
          });
        }
      } catch (error) {
        console.error("Profile page loadProfile error", error);
        if (mounted) {
          setProfileForm({
            full_name: user?.name || "",
            business_name: user?.businessName || "",
            email: user?.email || "",
          });
        }
      } finally {
        if (mounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setIsSavingProfile(true);

    try {
      const result = await updateProfile({
        full_name: profileForm.full_name,
        business_name: profileForm.business_name,
        email: profileForm.email,
      });

      if (result.success) {
        setProfileSuccess("Profile updated successfully.");
      } else {
        setProfileError(result.error || "Failed to update profile.");
      }
    } catch {
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await updateUserPassword(passwordForm.new_password);
      if (result.success) {
        setPasswordSuccess("Password updated successfully.");
        setPasswordForm(emptyPasswordForm);
      } else {
        setPasswordError(result.error || "Failed to update password.");
      }
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const { data: sessionData } = await (await import("@/lib/supabase/client")).supabase.auth.getUser();
      const sessionUser = sessionData.user;
      if (!sessionUser) {
        setDeleteError("You must be logged in to delete your account.");
        setIsDeleting(false);
        return;
      }

      const result = await deleteUserAccount(sessionUser.id);
      if (result.success) {
        await logout();
        router.push("/login");
      } else {
        setDeleteError(result.error || "Failed to delete account.");
        setIsDeleting(false);
      }
    } catch {
      setDeleteError("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card padding="default" className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10">
            <User className="h-6 w-6 text-[#7C5CFC]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Profile Information</h2>
            <p className="text-sm text-[#6B7280]">Update your personal details.</p>
          </div>
        </div>

        {profileError && (
          <div className="mb-4 rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
            {profileError}
          </div>
        )}
        {profileSuccess && (
          <div className="mb-4 rounded-[14px] border border-[#00C48C]/20 bg-[#00C48C]/5 px-4 py-3 text-sm text-[#00C48C]">
            {profileSuccess}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              Full Name
            </label>
            <Input
              id="full_name"
              value={profileForm.full_name}
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              placeholder="Enter your full name"
              disabled={isSavingProfile}
            />
          </div>

          <div>
            <label htmlFor="business_name" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              Business Name
            </label>
            <Input
              id="business_name"
              value={profileForm.business_name}
              onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
              placeholder="Enter your business name"
              disabled={isSavingProfile}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="Enter your email"
              disabled={isSavingProfile}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setProfileForm(emptyProfileForm)}
              disabled={isSavingProfile}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Card>

      <Card padding="default" className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10">
            <Lock className="h-6 w-6 text-[#7C5CFC]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Security</h2>
            <p className="text-sm text-[#6B7280]">Update your password.</p>
          </div>
        </div>

        {passwordError && (
          <div className="mb-4 rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="mb-4 rounded-[14px] border border-[#00C48C]/20 bg-[#00C48C]/5 px-4 py-3 text-sm text-[#00C48C]">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label htmlFor="new_password" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              New Password
            </label>
            <Input
              id="new_password"
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              placeholder="Enter new password"
              disabled={isChangingPassword}
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              Confirm Password
            </label>
            <Input
              id="confirm_password"
              type="password"
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              placeholder="Confirm new password"
              disabled={isChangingPassword}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPasswordForm(emptyPasswordForm)}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </Card>

      <Card padding="default" className="max-w-2xl border-[#FF5C5C]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5C5C]/10">
            <Trash2 className="h-6 w-6 text-[#FF5C5C]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Danger Zone</h2>
            <p className="text-sm text-[#6B7280]">Once you delete your account, there is no going back. Please be certain.</p>
          </div>
        </div>

        {deleteError && (
          <div className="mb-4 rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
            {deleteError}
          </div>
        )}

        {!showDeleteConfirm ? (
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
              Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Yes, Delete My Account"
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export { ProfilePage };
export default ProfilePage;
