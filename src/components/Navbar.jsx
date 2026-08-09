"use client";

import { useState } from "react";
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
} from "lucide-react";
import logo from "../assets/image/fresh mart logo.png"
import bg from "../assets/image/image 49.png"



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

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-white font-sans">
      {/* Top announcement bar */}
      <div className="bg-[#3F5632] text-[#F2E6CC]">
        <div className="mx-auto flex h-[38px] max-w-[1440px] items-center justify-center gap-[28px] px-[24px] text-[13px]">
          {TOP_BAR_ITEMS.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-[10px]">
              <Icon className="h-[15px] w-[15px] text-[#B8C2A5]" strokeWidth={1.75} />
              <span>{label}</span>
              {i < TOP_BAR_ITEMS.length - 1 && (
                <span className="ml-[28px] text-[#8FA07A]">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main nav row */}
      <div className="w-full border-b border-[#EDEDED] bg-white">
        <div className="mx-auto flex h-[94px] max-w-[1440px] items-center gap-[32px]">
          {/* Logo */}
          <a href="#" className="flex shrink-0 items-center gap-[10px]">
            <Image
      src={logo}
      alt="Logo"
     className="w-[87px] h-[59px]"
    />
          </a>

          {/* Delivery address */}
          <button className="flex shrink-0 items-center gap-[6px] text-[15px] font-medium text-[#1F2936]">
            <MapPin className="h-[18px] w-[18px] text-[#3F5632]" strokeWidth={1.75} />
            <span>Delivery Address</span>
            <ChevronDown className="h-[16px] w-[16px] text-[#1F2936]" strokeWidth={2} />
          </button>

          {/* Search bar */}
          <div className="flex h-[46px] flex-1 items-center rounded-full border border-[#D8DADD] pl-[20px] pr-[6px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for today?"
              className="h-full flex-1 bg-transparent text-[14px] text-[#1F2936] placeholder:text-[#94989F] focus:outline-none"
            />
            <button
              aria-label="Voice search"
              className="mr-[6px] flex h-[34px] w-[34px] items-center justify-center text-[#1F2936]"
            >
              <Mic className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
            <button
              aria-label="Search"
              className="flex h-[36px] w-[52px] items-center justify-center rounded-full bg-[#3F5632] text-white"
            >
              <Search className="h-[17px] w-[17px]" strokeWidth={2} />
            </button>
          </div>

          {/* Sign up / login */}
          <a
            href="#"
            className="flex shrink-0 items-center gap-[8px] text-[15px] font-medium text-[#1F2936]"
          >
            <User className="h-[19px] w-[19px]" strokeWidth={1.75} />
            <span>Sign Up/Log in</span>
          </a>

          {/* Cart */}
          <button aria-label="Cart" className="shrink-0 text-[#1F2936]">
            <ShoppingCart className="h-[21px] w-[21px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>

     <div className="relative ">
  <Image
    src={bg}
    alt=""
    className=""
  />
  <div className="absolute inset-x-0 bottom-8 flex items-center justify-between max-w-[1440px] mx-auto">
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
      
      <a  href="#"
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
    </header>
  );
}