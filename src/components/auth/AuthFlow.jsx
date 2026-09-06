"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import OtpModal from "./OtpModal";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthFlow({ onClose }) {
  const [step, setStep] = useState("auth"); // "auth" | "otp"
  const [contact, setContact] = useState(null);
  const setUser = useAuthStore((s) => s.setUser);

  const handleCodeSent = (contactInfo) => {
    setContact(contactInfo);
    setStep("otp");
  };

  const handleVerified = (user) => {
    setUser(user);
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