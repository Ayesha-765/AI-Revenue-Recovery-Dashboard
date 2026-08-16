"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, Store } from "lucide-react";

function SettingsPage() {
  const { user, updateProfile, refreshUser, isLoading } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (user && !initializedRef.current) {
      setFullName(user.name || "");
      setBusinessName(user.businessName || "");
      setEmail(user.email || "");
      initializedRef.current = true;
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    const result = await updateProfile({
      full_name: fullName.trim(),
      business_name: businessName.trim(),
    });

    if (result.success) {
      setSuccess(true);
      await refreshUser();
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Manage your account settings and preferences
        </p>
      </div>

      <Card padding="default">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3">
              <p className="text-sm text-[#FF5C5C]">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-[14px] border border-[#00C48C]/20 bg-[#00C48C]/5 px-4 py-3">
              <p className="text-sm text-[#00C48C]">Profile updated successfully!</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-[#1A1A1A]">
              Full Name
            </label>
            <div className="relative">
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="businessName" className="text-sm font-medium text-[#1A1A1A]">
              Business Name
            </label>
            <div className="relative">
              <Input
                id="businessName"
                type="text"
                placeholder="My Store"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                icon={<Store className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-[#F8FAFC] text-[#6B7280]"
            />
            <p className="text-xs text-[#6B7280]">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
            {success && (
              <p className="text-sm text-[#00C48C]">
                Changes saved successfully!
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export { SettingsPage };
export default SettingsPage;
