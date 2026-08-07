"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialEmail?: string;
}

function LoginModal({ isOpen, onClose, onSuccess, initialEmail }: LoginModalProps) {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = React.useState(initialEmail || "");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
        onSuccess?.();
        router.push("/dashboard");
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError("");
    setEmailError("");
    setPasswordError("");
    setPassword("");
    setRememberMe(false);
    if (!initialEmail) {
      setEmail("");
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/logo.png"
            alt="AI Revenue"
            className="h-20 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Sign in to your AI Revenue Recovery account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3">
              <p className="text-sm text-[#FF5C5C]">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className={emailError ? "border-[#FF5C5C] focus:ring-[#FF5C5C]/20" : ""}
            />
            {emailError && (
              <p className="text-xs text-[#FF5C5C]">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className={passwordError ? "border-[#FF5C5C] focus:ring-[#FF5C5C]/20" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-[#FF5C5C]">{passwordError}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-[6px] border-[#E8ECF3] text-[#7C5CFC] focus:ring-[#7C5CFC]"
              />
              <span className="text-sm text-[#6B7280]">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm font-medium text-[#7C5CFC] hover:text-[#6B4BE0] transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-6 rounded-[14px] bg-[#F8FAFC] p-4">
          <p className="text-xs font-medium text-[#1A1A1A] mb-1">Demo credentials</p>
          <p className="text-xs text-[#6B7280]">
            Email: demo@airevenue.com
          </p>
          <p className="text-xs text-[#6B7280]">
            Password: 12345678
          </p>
        </div>
      </div>
    </Modal>
  );
}

export { LoginModal, type LoginModalProps };
