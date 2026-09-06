"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

// Turns "balqees@gmail.com" -> "Balqees", or a phone number -> "User 6831"
function deriveDisplayName(contact) {
  if (contact.type === "email") {
    const localPart = contact.value.split("@")[0];
    const cleaned =
      localPart.replace(/[^a-zA-Z]/g, " ").trim().split(" ")[0] || localPart;
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  const digits = contact.value.replace(/\D/g, "");
  return `User ${digits.slice(-4)}`;
}

export default function OtpModal({ contact, onClose, onVerified }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const maskedContact =
    contact.type === "email"
      ? contact.value.replace(/^(.).*(@.*)$/, "$1****$2")
      : contact.value.replace(/^(\+?\d{1,3})\d+(\d{3})$/, "$1 *** $2");

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    if (val && index < digits.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < digits.length) {
      setError("Enter the full code");
      return;
    }

    setLoading(true);
    // TODO: replace with real API call once backend is ready
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network delay
    setLoading(false);

    const fakeUser = {
      id: `simulated-${Date.now()}`,
      email: contact.type === "email" ? contact.value : null,
      phone: contact.type === "phone" ? contact.value : null,
      user_metadata: { full_name: deriveDisplayName(contact) },
    };

    onVerified(fakeUser);
  };

  const handleResend = () => {
    setError("");
    // TODO: call real resend endpoint once backend is ready
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[500px] rounded-[8px] bg-white p-[32px] md:p-[32px] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 p-1 text-gray-700 hover:text-black transition-colors"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>

        {/* Header */}
        <h2 className="mt-2 text-center text-[22px] font-bold tracking-tight text-[#1E293B]">
          Verify account
        </h2>

        {/* Subtitle & Masked Contact */}
        <div className="mt-4 text-center text-[15px] font-normal leading-relaxed text-[#5C6672]">
          <p>Enter the {digits.length} digit code sent to</p>
          <p className="text-[#5C6672]">{maskedContact}</p>
        </div>

        {/* OTP Input Field Box Grid */}
        <div className="mt-6 flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
              className="h-14 w-14 rounded-[16px] border border-[#3B542C] bg-white text-center text-[20px] font-bold text-[#3B542C] transition-all focus:border-[#3B542C] focus:ring-2 focus:ring-[#3B542C]/20 focus:outline-none"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-3 text-center text-[13px] font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Verify Action Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-6 w-full rounded-[8px] bg-[#3B542C] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#324724] disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend Prompt */}
        <p className="mt-6 text-center text-[14px] font-normal text-[#5C6672]">
          Didn’t receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-[#D32F2F] hover:underline"
          >
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}