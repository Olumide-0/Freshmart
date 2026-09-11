"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

export default function OtpModal({ contact, onClose, onVerified }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const maskedContact =
    contact.type === "email"
      ? contact.value.replace(/^(.).*(@.*)$/, "$1****$2")
      : contact.value.replace(/^(\+?\d{1,3})\d+(\d{3})$/, "$1 *** $2");

  const code = digits.join("");
  const isComplete = digits.every((d) => d !== "");

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return; // block non-digit keystrokes
    setError("");
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < digits.length; i++) {
      next[i] = pasted[i] ?? "";
    }
    setDigits(next);
    const lastFilled = Math.min(pasted.length, digits.length) - 1;
    inputsRef.current[Math.max(lastFilled, 0)]?.focus();
  };

  const handleVerify = async () => {
    if (!isComplete) {
      setError(`Enter all ${digits.length} digits`);
      return;
    }
    if (!/^\d+$/.test(code)) {
      setError("Code must contain only numbers");
      return;
    }

    setLoading(true);
    // TODO: replace with real API call once backend is ready
    // e.g. await fetch("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ ...contact, code }) })
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
    setDigits(["", "", "", ""]);
    inputsRef.current[0]?.focus();
    // TODO: call real resend endpoint once backend is ready
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-[16px]">
      <div className="relative w-full max-w-[420px] rounded-[20px] bg-white p-[32px] shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute right-[20px] top-[20px]">
          <X className="h-[20px] w-[20px] text-[#1F2937]" strokeWidth={2} />
        </button>

        <h2 className="text-center text-[20px] font-extrabold text-[#1F2937]">Verify account</h2>
        <p className="mt-[10px] text-center text-[14px] text-gray-500">
          Enter the {digits.length} digit code sent to
          <br />
          <span className="font-semibold text-[#1F2937]">{maskedContact}</span>
        </p>

        <div className="mt-[24px] flex justify-center gap-[10px]" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-[48px] w-[48px] rounded-[10px] border border-gray-300 text-center text-[18px] font-bold text-[#1F2937] focus:border-[#3E5730] focus:outline-none"
            />
          ))}
        </div>
        {error && <p className="mt-[12px] text-center text-[13px] text-red-600">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading || !isComplete}
          className="mt-[24px] w-full rounded-[10px] bg-[#3E5730] py-[14px] text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p className="mt-[16px] text-center text-[13px] text-gray-500">
          Didn&rsquo;t receive a code?{" "}
          <button onClick={handleResend} className="font-semibold text-red-600">
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}

// Turns "balqees@gmail.com" -> "Balqees", or a phone number -> "User 6831"
function deriveDisplayName(contact) {
  if (contact.type === "email") {
    const localPart = contact.value.split("@")[0];
    const cleaned = localPart.replace(/[^a-zA-Z]/g, " ").trim().split(" ")[0] || localPart;
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  const digits = contact.value.replace(/\D/g, "");
  return `User ${digits.slice(-4)}`;
}