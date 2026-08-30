"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";
import logo from "../assets/image/fresh mart logo.png"
import bg from "../assets/image/image 49.png"
import AuthFlow from "@/components/auth/AuthFlow";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabaseClient";

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

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [setUser]);

  const displayName =
    user?.user_metadata?.full_name || user?.email || user?.phone || "Sign Up/Log in";

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
          <a href="#" className="flex shrink-0 items-center gap-[10px]">
            <Image
              src={logo}
              alt="Logo"
              className="h-[44px] w-[65px] lg:h-[59px] lg:w-[87px]"
            />
          </a>

          {/* Delivery address */}
          <button className="hidden shrink-0 items-center gap-[6px] text-[15px] font-medium text-[#1F2936] md:flex">
            <MapPin className="h-[18px] w-[18px] text-[#3F5632]" strokeWidth={1.75} />
            <span>Delivery Address</span>
            <ChevronDown className="h-[16px] w-[16px] text-[#1F2936]" strokeWidth={2} />
          </button>

          {/* Search bar */}
          <div className="order-last flex h-[42px] w-full items-center rounded-full border border-[#D8DADD] pl-[16px] pr-[6px] sm:order-none sm:h-[46px] sm:flex-1 sm:pl-[20px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for today?"
              className="h-full flex-1 bg-transparent text-[13px] text-[#1F2936] placeholder:text-[#94989F] focus:outline-none sm:text-[14px]"
            />
            <button
              aria-label="Voice search"
              className="mr-[6px] hidden h-[34px] w-[34px] items-center justify-center text-[#1F2936] sm:flex"
            >
              <Mic className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
            <button
              aria-label="Search"
              className="flex h-[32px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#3F5632] text-white sm:h-[36px] sm:w-[52px]"
            >
              <Search className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px]" strokeWidth={2} />
            </button>
          </div>

          {/* Sign up / login */}
          <button
            onClick={() => (user ? null : setAuthOpen(true))}
            className="ml-auto flex shrink-0 items-center gap-[8px] text-[15px] font-medium text-[#1F2936] sm:ml-0"
          >
            <User className="h-[19px] w-[19px]" strokeWidth={1.75} />
            <span className="hidden lg:inline">{displayName}</span>
          </button>

          {/* Cart */}
          <button aria-label="Cart" className="shrink-0 text-[#1F2936]">
            <ShoppingCart className="h-[21px] w-[21px]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Mobile menu panel (nav links + items that are hidden on small screens) */}
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
    </header>
  );
}