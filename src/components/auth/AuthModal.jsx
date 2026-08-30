"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthModal({ onClose, onCodeSent }) {
  const [tab, setTab] = useState("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!value.trim()) {
      setError(tab === "email" ? "Enter your email address" : "Enter your phone number");
      return;
    }

    setLoading(true);

    let payload;
    if (tab === "email") {
      payload = { email: value };
    } else {
      // Normalize to E.164: strip everything but digits, assume Nigerian numbers
      // starting with 0 need the leading 0 replaced with +234. Adjust the country
      // code below if most of your users are elsewhere.
      const digitsOnly = value.replace(/\D/g, "");
      const formatted = digitsOnly.startsWith("0")
        ? `+234${digitsOnly.slice(1)}`
        : digitsOnly.startsWith("234")
        ? `+${digitsOnly}`
        : `+${digitsOnly}`;
      payload = { phone: formatted };
    }

    const { error } = await supabase.auth.signInWithOtp(payload);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onCodeSent({ type: tab, value: tab === "phone" ? payload.phone : value });
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-[16px]">
      <div className="relative w-full max-w-[620px] rounded-[20px] bg-white p-[40px] shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute right-[24px] top-[24px]">
          <X className="h-[24px] w-[24px] text-[#1F2937]" strokeWidth={2} />
        </button>

        <h2 className="text-[28px] font-extrabold text-[#1F2937]">Log in or Sign up in seconds</h2>

        <div className="mt-[24px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[14px]">
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#E6F0E1] text-[18px]">🍊</span>
            <span className="text-[15px] text-[#4C545F]">Shop fresh and authentic Mexican groceries you love</span>
          </div>
          <div className="flex items-center gap-[14px]">
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#E6F0E1] text-[18px]">🎁</span>
            <span className="text-[15px] text-[#4C545F]">Get daily deals & groceries at cheaper prices</span>
          </div>
        </div>

        <div className="mt-[28px] flex gap-[24px] border-b border-gray-100">
          <button
            onClick={() => { setTab("email"); setError(""); }}
            className={`pb-[10px] text-[15px] font-bold ${tab === "email" ? "border-b-2 border-[#3E5730] text-[#1F2937]" : "text-gray-400"}`}
          >
            Via email
          </button>
          <button
            onClick={() => { setTab("phone"); setError(""); }}
            className={`pb-[10px] text-[15px] font-bold ${tab === "phone" ? "border-b-2 border-[#3E5730] text-[#1F2937]" : "text-gray-400"}`}
          >
            Via phone number
          </button>
        </div>

        <div className="mt-[24px] flex items-center gap-[12px] rounded-[12px] bg-[#F9F5EC] px-[20px] py-[14px]">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type={tab === "email" ? "email" : "tel"}
            placeholder={tab === "email" ? "Enter your email address" : "Enter your phone number"}
            className="flex-1 bg-transparent text-[15px] text-[#1F2937] placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            aria-label="Continue"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#3E5730] text-white disabled:opacity-60"
          >
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
        </div>
        {error && <p className="mt-[10px] text-[13px] text-red-600">{error}</p>}

        <div className="mt-[24px] flex items-center gap-[16px]">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[14px] text-gray-500">Or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          className="mt-[24px] flex w-full items-center justify-center gap-[10px] rounded-[12px] border border-gray-200 py-[14px] text-[15px] font-semibold text-[#1F2937]"
        >
          Continue with Google
        </button>

        <p className="mt-[20px] flex items-center gap-[8px] text-[13px] text-gray-500">
          🔒 Your information is secured with encryption
        </p>
        <p className="mt-[8px] text-[13px] text-gray-500">
          By proceeding, you agree to FreshMart&rsquo;s <span className="font-semibold underline">terms</span> &{" "}
          <span className="font-semibold underline">privacy policy</span>
        </p>
      </div>
    </div>
  );
}