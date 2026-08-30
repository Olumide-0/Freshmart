"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function OtpModal({ contact, onClose, onVerified }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
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

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < digits.length) {
      setError("Enter the full code");
      return;
    }

    setLoading(true);
    const { data, error } =
      contact.type === "email"
        ? await supabase.auth.verifyOtp({ email: contact.value, token: code, type: "email" })
        : await supabase.auth.verifyOtp({ phone: contact.value, token: code, type: "sms" });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onVerified(data.user);
  };

  const handleResend = async () => {
    setError("");
    if (contact.type === "email") {
      await supabase.auth.signInWithOtp({ email: contact.value });
    } else {
      await supabase.auth.signInWithOtp({ phone: contact.value });
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

        <div className="mt-[24px] flex justify-center gap-[10px]">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              maxLength={1}
              className="h-[48px] w-[48px] rounded-[10px] border border-gray-300 text-center text-[18px] font-bold text-[#1F2937] focus:border-[#3E5730] focus:outline-none"
            />
          ))}
        </div>
        {error && <p className="mt-[12px] text-center text-[13px] text-red-600">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
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