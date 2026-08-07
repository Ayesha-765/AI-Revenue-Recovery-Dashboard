"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import {
  LandingNavbar,
  HeroSection,
  ProblemSection,
  SolutionSection,
  HowItWorks,
  FeaturesSection,
  WhyChooseUs,
  DashboardPreview,
  Testimonials,
  FAQSection,
  CTASection,
  Footer,
} from "@/components/landing";
import { LoginModal } from "@/components/auth/login-modal";
import { SignUpModal } from "@/components/auth/signup-modal";

function LandingPageClient() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const loginParam = searchParams.get("login");
  const shouldAutoOpen = loginParam === "1" && !isAuthenticated;

  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(shouldAutoOpen);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = React.useState(false);
  const [signUpEmail, setSignUpEmail] = React.useState("");
  const [loginModalKey, setLoginModalKey] = React.useState(0);

  const handleLoginClick = React.useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleSignUpClick = React.useCallback(() => {
    setIsSignUpModalOpen(true);
  }, []);

  const handleSignUpSuccess = React.useCallback((email: string) => {
    setSignUpEmail(email);
    setIsSignUpModalOpen(false);
    setLoginModalKey((prev) => prev + 1);
    setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 300);
  }, []);

  const handleLoginSuccess = React.useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleCloseLoginModal = React.useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleCloseSignUpModal = React.useCallback(() => {
    setIsSignUpModalOpen(false);
    setSignUpEmail("");
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNavbar onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} />
      <main>
        <HeroSection onSignUpClick={handleSignUpClick} />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <FeaturesSection />
        <WhyChooseUs />
        <DashboardPreview />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <LoginModal
        key={loginModalKey}
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSuccess={handleLoginSuccess}
        initialEmail={signUpEmail}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={handleCloseSignUpModal}
        onSuccess={handleSignUpSuccess}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <LandingPageClient />
    </Suspense>
  );
}
