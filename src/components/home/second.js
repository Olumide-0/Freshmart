"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import bakery from "../../assets/image/Frame 88.png";
import frozen from "../../assets/image/Frame 89.png";
import meat from "../../assets/image/Frame 90.png";
import dairy from "../../assets/image/Frame 91.png";
import produce from "../../assets/image/Frame 92.png";
import orange from "../../assets/image/image 55.png";
import cucumber from "../../assets/image/image 85.png";
import snacks from "../../assets/image/Frame 94.png";
import { ArrowRight, X, ChevronRight } from "lucide-react";

const DEPARTMENTS = [
  { label: "Fresh Produce", slug: "fresh-produce", image: produce },
  { label: "Bakery", slug: "bakery", image: bakery },
  { label: "Frozen Foods", slug: "frozen-foods", image: frozen },
  { label: "Meat & Sea Foods", slug: "meat-seafood", image: meat },
  { label: "Dairy & Eggs", slug: "dairy-eggs", image: dairy },
];

const ALL_CATEGORIES = [
  { label: "Fresh Produce", slug: "fresh-produce", image: produce },
  { label: "Bakery", slug: "bakery", image: bakery },
  { label: "Frozen foods", slug: "frozen-foods", image: frozen },
  { label: "Meat & seafood", slug: "meat-seafood", image: meat },
  { label: "Dairy & Eggs", slug: "dairy-eggs", image: dairy },
  { label: "Beverages", slug: "beverages", image: orange },
  { label: "Fruits", slug: "fruits", image: cucumber },
  { label: "Snacks", slug: "snacks", image: snacks },
];

export default function Second() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-[#F6F0E3] -mt-10 px-[120px] py-[68px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[26px] font-extrabold text-[#1F2937]">
          Shop by Department
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[16px] font-semibold text-[#3E5730]"
        >
          View All
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-[28px] grid grid-cols-5 gap-[22px]">
        {DEPARTMENTS.map(({ label, slug, image }) => (
          <Link key={label} href={`/products/${slug}`}>
            <Image
              src={image}
              alt={label}
              className="h-[260px] w-full rounded-[8px] border border-[#E4A94CD9] object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Sidebar modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/45" />

        <div
          className={`absolute right-0 top-0 mt-15 h-[85%] w-full max-w-[560px] transform rounded-tl-xl rounded-bl-xl bg-white px-[40px] py-[36px] shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-extrabold text-[#1F2937]">All Categories</h2>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-[26px] w-[26px] text-[#1F2937]" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-[28px] flex h-[calc(100%-90px)] flex-col gap-[16px] overflow-y-auto pr-[10px]">
            {ALL_CATEGORIES.map(({ label, slug, image }) => (
              <Link
                key={label}
                href={`/products/${slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-[16px] rounded-2xl border border-[#F0D2A8] bg-white p-[10px]"
              >
                <Image
                  src={image}
                  alt={label}
                  className="h-[72px] w-[96px] shrink-0 rounded-xl object-cover"
                />
                <span className="flex-1 text-[17px] font-bold text-[#1F2937]">{label}</span>
                <ChevronRight className="h-[20px] w-[20px] shrink-0 text-[#1F2937]" strokeWidth={2.5} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}