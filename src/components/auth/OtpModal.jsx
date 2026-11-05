"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { getAuthErrorMessage, requestOtp, verifyOtp } from "@/lib/auth";
import { maskPhone } from "@/lib/phone";

// contact: { type: "email" | "phone", value, dial? } from AuthModal.
// For phone, value is international (e.g. +2348031234567) and dial its country code.
export default function OtpModal({ contact, onClose, onVerified }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState(""); // "A new code has been sent."
  const inputsRef = useRef([]);

  const maskedContact =
    contact.type === "email"
      ? contact.value.replace(/^(.).*(@.*)$/, "$1****$2")
      : maskPhone(contact.value, contact.dial); // "+234 *** 567"

  const code = digits.join("");
  const isComplete = digits.every((d) => d !== "");

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return; // block non-digit keystrokes
    setError("");
    setNotice("");
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
    setNotice("");
    try {
      // { token, user } -> AuthFlow stores the session and closes the modal.
      const session = await verifyOtp(contact, code);
      onVerified(session);
    } catch (err) {
      // "Incorrect code", "This code has expired. Request a new one", 429, network.
      setError(getAuthErrorMessage(err));
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setError("");
    setNotice("");
    setResending(true);
    try {
      await requestOtp(contact);
      setDigits(["", "", "", ""]);
      setNotice("A new code has been sent.");
      inputsRef.current[0]?.focus();
    } catch (err) {
      // 429 shows the API's cooldown message.
      setError(getAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
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
        {notice && !error && (
          <p className="mt-[12px] text-center text-[13px] text-gray-500">{notice}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || resending || !isComplete}
          className="mt-[24px] w-full rounded-[10px] bg-[#3E5730] py-[14px] text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p className="mt-[16px] text-center text-[13px] text-gray-500">
          Didn&rsquo;t receive a code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-red-600 disabled:opacity-60"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}