"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Clock,
  ShieldCheck,
  MapPin,
  ChevronDown,
  Mic,
  Search,
  User,
  ShoppingCart,
  Mail,
  Menu,
  X,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import logo from "../assets/image/fresh mart logo.png"
import bg from "../assets/image/image 49.png"
import AuthFlow from "@/components/auth/AuthFlow";
import CartPanel from "@/components/cart/CartPanel";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

const TOP_BAR_ITEMS = [
  { icon: Leaf, label: "Free deliveries on orders over MXN $699" },
  { icon: Clock, label: "Delivery in 60Min" },
  { icon: ShieldCheck, label: "100% Freshness Guarantee" },
];

const NAV_LINKS = [
  { label: "Shop", href: "#", hasDropdown: true },
  { label: "Offers", href: "#" },
  { label: "Recipes", href: "#" },
  { label: "Local producers", href: "#" },
  { label: "Help & Support", href: "#" },
];

// Voice search language options — default is English (US)
const VOICE_LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "es-MX", label: "Español (MX)" },
  { code: "fr-FR", label: "Français" },
  { code: "pt-BR", label: "Português" },
  { code: "de-DE", label: "Deutsch" },
];

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginWarning, setLoginWarning] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // --- Voice search state ---
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceLang, setVoiceLang] = useState("en-US"); // default: English
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const recognitionRef = useRef(null);
  const submitOnEndRef = useRef(false); // whether to auto-search once recognition ends

  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const displayName =
    user?.user_metadata?.full_name || user?.email || user?.phone || "Sign Up/Log in";

  const handleCartClick = () => {
    if (!user) {
      setLoginWarning(true);
      setTimeout(() => setLoginWarning(false), 3000);
      return;
    }
    setCartOpen(true);
  };

  const handleAccountClick = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setAccountMenuOpen((open) => !open);
  };

  // Opens the confirmation modal instead of logging out immediately
  const handleLogoutClick = () => {
    setAccountMenuOpen(false); // close the dropdown so it's not sitting behind the modal
    setMobileMenuOpen(false);
    setLogoutConfirmOpen(true);
  };

  // Actually performs the logout — only called after the user confirms
  const confirmLogout = () => {
    clearUser();
    clearCart(); // cart is per-account; clear it on sign-out so the next user starts fresh
    setLogoutConfirmOpen(false);
    router.push("/");
  };

  // Close the account dropdown on outside click
  useEffect(() => {
    if (!accountMenuOpen) return;
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  // --- Search handler — pushes to /search?q=... which reads from data/product.js ---
  const handleSearch = (searchTerm) => {
    const term = (searchTerm ?? query).trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // --- Translates non-English transcripts to English before searching ---
  const translateAndSearch = async (text, lang) => {
    const langPrefix = lang.split("-")[0];
    if (langPrefix === "en" || !text.trim()) {
      handleSearch(text);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang: lang }),
      });
      const data = await res.json();
      const translated = data?.translatedText || text;

      setQuery(translated); // update the input so the user sees what was searched
      handleSearch(translated);
    } catch (err) {
      console.error("Translate-and-search failed:", err);
      handleSearch(text); // fall back to original transcript
    } finally {
      setIsTranslating(false);
    }
  };

  // --- Set up SpeechRecognition, recreated whenever the language changes ---
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLang;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setQuery(transcript);
    };

    recognition.onerror = (event) => {
      // "no-speech" and "aborted" are expected, not real failures — don't log them as errors
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
      submitOnEndRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      if (submitOnEndRef.current) {
        submitOnEndRef.current = false;
        setQuery((current) => {
          if (current.trim()) translateAndSearch(current, voiceLang);
          return current;
        });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.stop();
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceLang]);

  const handleMicClick = () => {
    if (!voiceSupported) {
      alert("Voice search isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      submitOnEndRef.current = false;
      recognition.stop();
    } else {
      setQuery("");
      submitOnEndRef.current = true; // auto-search once speech finishes
      try {
        recognition.start();
      } catch (err) {
        // start() throws if called while already active — ignore
        console.warn(err);
      }
    }
  };

  const selectedLangLabel =
    VOICE_LANGUAGES.find((l) => l.code === voiceLang)?.label ?? "English";

  return (
    <header className="fixed inset-x-0 top-0 z-[100] w-full bg-white font-sans">
      {/* Top announcement bar */}
      <div className="bg-[#3F5632] text-[#F2E6CC]">
        <div className="mx-auto flex h-auto min-h-[38px] max-w-[1440px] flex-wrap items-center justify-center gap-x-[14px] gap-y-[6px] px-[16px] py-[6px] text-[11px] sm:gap-x-[20px] sm:py-[8px] sm:text-[12px] md:h-[38px] md:flex-nowrap md:gap-x-[28px] md:px-[24px] md:py-0 md:text-[13px]">
          {TOP_BAR_ITEMS.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-[8px] md:gap-[10px]">
              <Icon className="h-[14px] w-[14px] shrink-0 text-[#B8C2A5] md:h-[15px] md:w-[15px]" strokeWidth={1.75} />
              <span className="whitespace-nowrap">{label}</span>
              {i < TOP_BAR_ITEMS.length - 1 && (
                <span className="ml-[14px] text-[#8FA07A] sm:ml-[20px] md:ml-[28px]">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main nav row */}
      <div className="w-full border-b border-[#EDEDED] bg-white">
        <div className="mx-auto flex h-auto max-w-[1440px] flex-wrap items-center gap-[12px] px-[16px] py-[12px] sm:flex-nowrap sm:gap-[20px] sm:px-[24px] lg:h-[94px] lg:gap-[32px] lg:px-[44px] lg:py-0">
          {/* Mobile menu toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex shrink-0 items-center justify-center text-[#1F2936] lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-[22px] w-[22px]" strokeWidth={1.75} />
            ) : (
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.75} />
            )}
          </button>

          {/* Logo */}
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              className="h-[44px] w-[68px] lg:h-[59px] lg:w-[87px]"
            />
          </Link>

          {/* Delivery address */}
          <button className="hidden shrink-0 items-center gap-[6px] text-[15px] font-medium text-[#1F2936] md:flex">
            <MapPin className="h-[18px] w-[18px] text-[#3F5632]" strokeWidth={1.75} />
            <span>Delivery Address</span>
            <ChevronDown className="h-[16px] w-[16px] text-[#1F2936]" strokeWidth={2} />
          </button>

          {/* Search bar */}
          <div className="relative order-last flex h-[42px] w-full items-center rounded-full border border-[#D8DADD] pl-[16px] pr-[6px] sm:order-none sm:h-[46px] sm:flex-1 sm:pl-[20px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              disabled={isTranslating}
              placeholder={
                isListening
                  ? "Listening..."
                  : isTranslating
                  ? "Translating..."
                  : "What are you looking for today?"
              }
              className="h-full flex-1 bg-transparent text-[13px] text-[#1F2936] placeholder:text-[#94989F] focus:outline-none disabled:opacity-60 sm:text-[14px]"
            />

            {/* Language picker for voice search */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                aria-label="Voice search language"
                onClick={() => setLangMenuOpen((open) => !open)}
                className="mr-[4px] flex h-[34px] items-center gap-[3px] rounded-full px-[6px] text-[11px] font-medium text-[#6B7280] hover:bg-[#F4F4F5]"
              >
                {selectedLangLabel}
                <ChevronDown className="h-[12px] w-[12px]" strokeWidth={2} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-[40px] z-[110] w-[160px] overflow-hidden rounded-[12px] border border-[#EDEDED] bg-white py-[6px] shadow-lg">
                  {VOICE_LANGUAGES.map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setVoiceLang(code);
                        setLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-[14px] py-[8px] text-left text-[13px] hover:bg-[#F4F4F5] ${
                        code === voiceLang ? "font-semibold text-[#3F5632]" : "text-[#1F2936]"
                      }`}
                    >
                      {label}
                      {code === voiceLang && (
                        <CheckCircle2 className="h-[14px] w-[14px] text-[#3F5632]" strokeWidth={2} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label={isListening ? "Stop voice search" : "Voice search"}
              onClick={handleMicClick}
              className={`mr-[6px] hidden h-[34px] w-[34px] items-center justify-center rounded-full transition-colors sm:flex ${
                isListening ? "bg-red-100 text-red-600" : "text-[#1F2936]"
              }`}
            >
              <Mic
                className={`h-[18px] w-[18px] cursor-pointer ${isListening ? "animate-pulse" : ""}`}
                strokeWidth={1.75}
              />
            </button>
            <button
              aria-label="Search"
              onClick={() => handleSearch()}
              className="flex h-[32px] w-[46px] shrink-0 items-center justify-center cursor-pointer rounded-full bg-[#3F5632] text-white sm:h-[36px] sm:w-[52px]"
            >
              <Search className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px]" strokeWidth={2} />
            </button>
          </div>

          {/* Sign up / login / account menu */}
          <div className="relative ml-auto shrink-0 sm:ml-0" ref={accountMenuRef}>
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-[8px] text-[15px] font-medium text-[#1F2936]"
            >
              <User className="h-[19px] w-[19px]" strokeWidth={1.75} />
              <span className="hidden lg:inline">{displayName}</span>
              {user && (
                <ChevronDown
                  className={`hidden h-[14px] w-[14px] transition-transform lg:inline ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              )}
            </button>

            {user && accountMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[110] w-[200px] overflow-hidden rounded-[12px] border border-[#EDEDED] bg-white py-[8px] shadow-lg">
                <div className="border-b border-gray-100 px-[16px] py-[10px]">
                  <p className="truncate text-[14px] font-semibold text-[#1F2937]">{displayName}</p>
                  {(user.email || user.phone) && (
                    <p className="truncate text-[12px] text-gray-500">{user.email || user.phone}</p>
                  )}
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-[10px] px-[16px] py-[10px] text-left text-[14px] font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-[16px] w-[16px]" strokeWidth={2} />
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button aria-label="Cart" onClick={handleCartClick} className="relative shrink-0 text-[#1F2936]">
            <ShoppingCart className="h-[21px] w-[21px]" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-[8px] -top-[8px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#C1652E] text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="border-t border-[#EDEDED] bg-white px-[16px] py-[16px] lg:hidden">
            <button className="mb-[16px] flex items-center gap-[6px] text-[15px] font-medium text-[#1F2936] md:hidden">
              <MapPin className="h-[18px] w-[18px] text-[#3F5632]" strokeWidth={1.75} />
              <span>Delivery Address</span>
              <ChevronDown className="h-[16px] w-[16px] text-[#1F2936]" strokeWidth={2} />
            </button>
            <nav className="flex flex-col gap-[14px]">
              {NAV_LINKS.map(({ label, href, hasDropdown }) => (
                <a key={label}
                  href={href}
                  className="flex items-center gap-[10px] text-[16px] font-bold text-[#1F2937]"
                >
                  {label}
                  {hasDropdown && (
                    <ChevronDown className="h-[14px] w-[14px]" strokeWidth={2.5} />
                  )}
                </a>
              ))}
              <a href="#" className="text-[16px] font-bold text-[#1F2937]">
                FAQs
              </a>
              <a href="#"
                className="flex w-fit items-center gap-[10px] rounded-full border border-[#C7C9CD] bg-white py-[6px] pl-[6px] pr-[16px]"
              >
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#C1652E]">
                  <Mail className="h-[14px] w-[14px] text-white" strokeWidth={2} />
                </span>
                <span className="text-[16px] font-semibold text-[#1F2937]">
                  Email Support
                </span>
              </a>
              {user && (
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-[10px] text-[16px] font-bold text-red-600"
                >
                  <LogOut className="h-[16px] w-[16px]" strokeWidth={2} />
                  Log out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>

      <div className="relative">
        <Image
          src={bg}
          alt=""
          className="h-auto w-full"
        />
        <div className="absolute inset-x-0 bottom-4 hidden max-w-[1440px] items-center justify-between mx-auto px-[24px] lg:bottom-8 lg:flex lg:px-[62px]">
          <nav className="flex items-center gap-[32px]">
            {NAV_LINKS.map(({ label, href, hasDropdown }) => (
              <a key={label}
                href={href}
                className="flex items-center gap-[21px] text-[16px] font-bold text-[#1F2937]"
              >
                {label}
                {hasDropdown && (
                  <ChevronDown className="h-[14px] w-[14px]" strokeWidth={2.5} />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[28px]">
            <a href="#" className="text-[16px] font-bold text-[#1F2937]">
              FAQs
            </a>

            <a href="#"
              className="flex items-center gap-[10px] rounded-full border border-[#C7C9CD] bg-white py-[6px] pl-[6px] pr-[16px]"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#C1652E]">
                <Mail className="h-[14px] w-[14px] text-white" strokeWidth={2} />
              </span>
              <span className="text-[16px] font-semibold text-[#1F2937]">
                Email Support
              </span>
            </a>
          </div>
        </div>
      </div>

      {authOpen && <AuthFlow onClose={() => setAuthOpen(false)} />}
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}

      {loginWarning && (
        <div className="fixed right-[24px] top-[24px] z-[300] w-[340px] rounded-[14px] bg-white px-[20px] py-[16px] shadow-xl">
          <p className="text-[14px] font-semibold text-[#1F2937]">
            Please sign up or log in to access your cart.
          </p>
          <button
            onClick={() => {
              setLoginWarning(false);
              setAuthOpen(true);
            }}
            className="mt-[8px] text-[13px] font-semibold text-[#3E5730] underline"
          >
            Sign up / Log in
          </button>
        </div>
      )}

      {/* Logout confirmation modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 px-[16px]">
          <div className="w-full max-w-[460px]  rounded-[16px] bg-white px-[24px] p-[28px] text-center shadow-xl">
            <p className="text-[20px] font-bold text-[#1F2937]">
              Are you sure you want to log out?
            </p>

            <div className="mt-[20px] flex flex-col gap-[10px]">
              <button
                onClick={confirmLogout}
                className="w-full rounded-[8px] bg-[#3F5632] py-[10px] text-[14px] font-semibold text-white"
              >
                Yes
              </button>

              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="flex w-full items-center justify-center gap-[8px] rounded-[8px] border border-[#D8DADD] py-[10px] text-[14px] font-semibold text-[#1F2936]"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" fill="#FFD93B" />
                  <circle cx="8.5" cy="10" r="1.3" fill="#3F3F3F" />
                  <circle cx="15.5" cy="10" r="1.3" fill="#3F3F3F" />
                  <path
                    d="M7.5 14.2C8.7 16 10.2 17 12 17c1.8 0 3.3-1 4.5-2.8"
                    stroke="#3F3F3F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                No, I'm joking
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}