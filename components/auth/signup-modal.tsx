"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Eye, EyeOff, Check } from "lucide-react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

type PasswordStrength = "weak" | "medium" | "strong";

function PasswordStrengthIndicator({ password }: { password: string }) {
  if (!password) return null;

  let strength: PasswordStrength = "weak";
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    strength = "strong";
  } else if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    strength = "medium";
  }

  const config = {
    weak: { label: "Weak", color: "bg-[#FF5C5C]", width: "33%" },
    medium: { label: "Medium", color: "bg-[#FFB800]", width: "66%" },
    strong: { label: "Strong", color: "bg-[#00C48C]", width: "100%" },
  };

  const current = config[strength];

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${current.color}`}
          style={{ width: current.width }}
        />
      </div>
      <p className="text-xs text-[#6B7280]">
        Password strength: <span className="font-medium">{current.label}</span>
      </p>
    </div>
  );
}

function SignUpModal({ isOpen, onClose, onSuccess }: SignUpModalProps) {
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  const [fullNameError, setFullNameError] = React.useState("");
  const [businessNameError, setBusinessNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
  const [termsError, setTermsError] = React.useState("");

  const validateFullName = (value: string) => {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Please enter a valid full name";
    return "";
  };

  const validateBusinessName = (value: string) => {
    if (!value.trim()) return "Business name is required";
    if (value.trim().length < 2) return "Please enter a valid business name";
    return "";
  };

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

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const fullNameErr = validateFullName(fullName);
    const businessNameErr = validateBusinessName(businessName);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);
    const termsErr = !agreeTerms ? "You must agree to the terms and conditions" : "";

    setFullNameError(fullNameErr);
    setBusinessNameError(businessNameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);
    setTermsError(termsErr);

    if (fullNameErr || businessNameErr || emailErr || passwordErr || confirmPasswordErr || termsErr) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        name: fullName.trim(),
        businessName: businessName.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        setSuccess(true);
        setSuccessMessage("Account created successfully! Please sign in with your credentials.");
        onSuccess?.(email.trim());

        setTimeout(() => {
          handleClose();
        }, 2000);
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
    setSuccess(false);
    setSuccessMessage("");
    setFullNameError("");
    setBusinessNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");
    setFullName("");
    setBusinessName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgreeTerms(false);
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
            Create Account
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Start recovering lost revenue with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3">
              <p className="text-sm text-[#FF5C5C]">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-[14px] border border-[#00C48C]/20 bg-[#00C48C]/5 px-4 py-3">
              <p className="text-sm text-[#00C48C]">{successMessage}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-[#1A1A1A]">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setFullNameError("");
              }}
              className={fullNameError ? "border-[#FF5C5C] focus:ring-[#FF5C5C]/20" : ""}
            />
            {fullNameError && (
              <p className="text-xs text-[#FF5C5C]">{fullNameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="businessName" className="text-sm font-medium text-[#1A1A1A]">
              Business Name
            </label>
            <Input
              id="businessName"
              type="text"
              placeholder="My Store"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                setBusinessNameError("");
              }}
              className={businessNameError ? "border-[#FF5C5C] focus:ring-[#FF5C5C]/20" : ""}
            />
            {businessNameError && (
              <p className="text-xs text-[#FF5C5C]">{businessNameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">
              Email Address
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
                placeholder="Min. 8 characters"
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
            <PasswordStrengthIndicator password={password} />
            {passwordError && (
              <p className="text-xs text-[#FF5C5C]">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#1A1A1A]">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                className={confirmPasswordError ? "border-[#FF5C5C] focus:ring-[#FF5C5C]/20" : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-[#FF5C5C]">{confirmPasswordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setTermsError("");
                }}
                className="h-4 w-4 mt-0.5 rounded-[6px] border-[#E8ECF3] text-[#7C5CFC] focus:ring-[#7C5CFC]"
              />
              <span className="text-sm text-[#6B7280]">
                I agree to the{" "}
                <button type="button" className="text-[#7C5CFC] hover:text-[#6B4BE0] transition-colors">
                  Terms & Conditions
                </button>
                {" "}and{" "}
                <button type="button" className="text-[#7C5CFC] hover:text-[#6B4BE0] transition-colors">
                  Privacy Policy
                </button>
              </span>
            </label>
            {termsError && (
              <p className="text-xs text-[#FF5C5C]">{termsError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || isLoading || success}
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account...
              </div>
            ) : success ? (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Account Created
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B7280]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                handleClose();
                onSuccess?.(email);
              }}
              className="text-sm font-medium text-[#7C5CFC] hover:text-[#6B4BE0] transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}

export { SignUpModal, type SignUpModalProps };
