"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, ArrowRight, Gift, Lock, Citrus } from "lucide-react";
import Image from "next/image";
import apple from "../../assets/image/image 98.png"
import grape from "../../assets/image/image 95 (1).png"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ onClose, onCodeSent }) {
  const [tab, setTab] = useState("email");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const switchTab = (nextTab) => {
    setTab(nextTab);
    reset(); // clear input + errors when switching tabs
  };

  const { onChange: rhfOnChange, ...contactField } = register("contact", {
    validate: (value) => {
      if (!value || !value.trim()) {
        return tab === "email"
          ? "Email is required"
          : "Phone number is required";
      }

      if (tab === "email") {
        if (!EMAIL_REGEX.test(value.trim())) {
          return "Enter a valid email address (e.g. name@example.com)";
        }
      }

      if (tab === "phone") {
        if (!/^\d+$/.test(value)) {
          return "Only numbers are allowed";
        }
        if (value.length < 10) {
          return "Phone number must be at least 10 digits";
        }
        if (value.length > 15) {
          return "Phone number is too long";
        }
      }

      return true;
    },
  });

  const handleContactChange = (e) => {
    if (tab === "phone") {
      const value = e.target.value.replace(/\D/g, "");
      setValue("contact", value, { shouldValidate: false });
      rhfOnChange({ target: { name: "contact", value } });
    } else {
      rhfOnChange(e);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    // TODO: replace with real API call once backend is ready
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network delay
    setLoading(false);

    onCodeSent({ type: tab, value: data.contact.trim() });
  };

  const handleGoogle = () => {
    // TODO: wire to real Google OAuth once backend is ready
    alert("Google sign-in isn't connected yet.");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[800px] overflow-hidden rounded-[28px] bg-white p-9 md:p-11 shadow-2xl">
        {/* Decorative Produce - Top Right Corner */}
        <div className="pointer-events-none absolute -right-6 -top-16 w-44 overflow-hidden ">
          <Image
            src={apple}
            alt=""
            className="h-full w-full object-cover object-center "
          />
        </div>

        {/* Decorative Produce - Bottom Left Corner */}
        <div className="pointer-events-none absolute -bottom-4 -left-10   overflow-hidden ">
          <Image
            src={grape}
            alt=""
            className="h-full w-full object-cover object-center "
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-28 top-20 z-10 p-1 text-gray-700 hover:text-black transition-colors"
        >
          <X className="h-7 w-7" strokeWidth={1.75} />
        </button>

        {/* Header */}
        <h2 className="pr-12 text-[26px] font-bold tracking-tight text-[#1E293B]">
          Log in or Sign up in seconds
        </h2>

        {/* Value Propositions */}
        <div className="mt-6 flex flex-col gap-3.5">
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF3E7] text-[#3B542C]">
              <Citrus className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="text-[15px] font-normal text-[#5C6672]">
              Shop fresh and authentic Mexican groceries you love
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF3E7] text-[#3B542C]">
              <Gift className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="text-[15px] font-normal text-[#5C6672]">
              Get daily deals & groceries at cheaper prices
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-7 flex items-center gap-6">
          <button
            type="button"
            onClick={() => switchTab("email")}
            className={`relative pb-2 text-[15px] font-semibold transition-colors ${
              tab === "email" ? "text-[#3B542C]" : "text-[#A0A5AD]"
            }`}
          >
            Via email
            {tab === "email" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#3B542C]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => switchTab("phone")}
            className={`relative pb-2 text-[15px] font-semibold transition-colors ${
              tab === "phone" ? "text-[#3B542C]" : "text-[#A0A5AD]"
            }`}
          >
            Via phone number
            {tab === "phone" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#3B542C]" />
            )}
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <div className="flex items-center justify-between rounded-[18px] bg-[#FAF7F2] p-2 pl-5 transition-all focus-within:ring-2 focus-within:ring-[#3B542C]/20">
            <input
              {...contactField}
              onChange={handleContactChange}
              type={tab === "email" ? "email" : "tel"}
              inputMode={tab === "phone" ? "numeric" : "email"}
              placeholder={
                tab === "email"
                  ? "Enter your email address"
                  : "Enter your phone number"
              }
              className="w-full bg-transparent text-[15px] text-[#1E293B] placeholder:text-[#A0A5AD] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Continue"
              className="flex h-11 w-16 shrink-0 items-center justify-center rounded-full bg-[#3B542C] text-white transition-opacity hover:bg-[#324724] disabled:opacity-60"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          {errors.contact && (
            <p className="mt-2 text-[13px] text-red-600 pl-2">
              {errors.contact.message}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="mt-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[14px] font-medium text-[#7A828A]">Or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogle}
          className="mt-6 flex w-full items-center justify-center rounded-[16px] border border-gray-300 py-3.5 transition-colors hover:bg-gray-50"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </button>

        {/* Footer Security & Terms */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#5C6672]">
            <Lock className="h-4 w-4 text-[#5C6672]" strokeWidth={2.2} />
            <span>Your information is secured with encryption</span>
          </div>
          <p className="mt-3 text-[13px] font-normal text-[#6B7280]">
            By proceeding, you agree to FreshMart’s{" "}
            <span className="font-semibold text-[#374151]">terms</span> &{" "}
            <span className="font-semibold text-[#374151]">privacy policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}