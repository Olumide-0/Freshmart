"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import OtpModal from "./OtpModal";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthFlow({ onClose }) {
  const [step, setStep] = useState("auth"); // "auth" | "otp"
  const [contact, setContact] = useState(null);
  const setSession = useAuthStore((s) => s.setSession);

  const handleCodeSent = (contactInfo) => {
    setContact(contactInfo);
    setStep("otp");
  };

  // session: { token, user } from POST /auth/verify-otp
  const handleVerified = (session) => {
    setSession(session);
    onClose();
  };

  return (
    <>
      {step === "auth" && <AuthModal onClose={onClose} onCodeSent={handleCodeSent} />}
      {step === "otp" && (
        <OtpModal contact={contact} onClose={onClose} onVerified={handleVerified} />
      )}
    </>
  );
}