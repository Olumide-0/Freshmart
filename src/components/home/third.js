"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import school from "../../assets/image/image 61.png";
import party from "../../assets/image/image 133.png";
import bbq from "../../assets/image/image 134.png";
import breakfast from "../../assets/image/Frame 92 (1).png";
import healthy from "../../assets/image/Frame 102.png";
import mexican from "../../assets/image/Frame 103.png";
import seasonal from "../../assets/image/Frame 107.png";
import { ArrowRight, X, ChevronRight } from "lucide-react";

const OCCASIONS = [
  { label: "Breakfast", slug: "breakfast", image: breakfast },
  { label: "Healthy living", slug: "healthy-living", image: healthy },
  { label: "Mexican Favourites", slug: "mexican-favourites", image: mexican },
  { label: "Seasonal Specials", slug: "seasonal-specials", image: seasonal },
];

const ALL_CATEGORIES = [
  { label: "Breakfast", slug: "breakfast", image: breakfast },
  { label: "Healthy living", slug: "healthy-living", image: healthy },
  { label: "Mexican favourites", slug: "mexican-favourites", image: mexican },
  { label: "Seasonal specials", slug: "seasonal-specials", image: seasonal },
  { label: "Party essentials", slug: "party-essentials", image: party },
  { label: "Back to school", slug: "back-to-school", image: school },
  { label: "BBQ & Grills", slug: "bbq-grills", image: bbq },
];

export default function Third() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-[#F6F0E3] -mt-10 px-[120px] py-[68px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[26px] font-extrabold text-[#1F2937]">
          Shop by Occasion
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[16px] font-semibold text-[#3E5730]"
        >
          View All
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-[28px] grid grid-cols-4 gap-[24px]">
        {OCCASIONS.map(({ label, slug, image }) => (
          <Link
            key={label}
            href={`/occasions/${slug}`}
            className="relative overflow-hidden rounded-2xl"
          >
            <Image
              src={image}
              alt={label}
              className="h-full w-full object-cover"
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
          className={`absolute right-0 top-0 mt-15 h-[80%] w-full max-w-[560px] transform rounded-tl-xl rounded-bl-xl bg-white px-[40px] py-[36px] shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-extrabold text-[#1F2937]">
              All Categories
            </h2>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-[26px] w-[26px] text-[#1F2937]" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-[28px] flex h-[calc(100%-90px)] flex-col gap-[16px] overflow-y-auto pr-[10px]">
            {ALL_CATEGORIES.map(({ label, slug, image }) => (
              <Link
                key={label}
                href={`/occasions/${slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-[16px] rounded-2xl border border-[#F0D2A8] bg-white p-[10px]"
              >
                <Image
                  src={image}
                  alt={label}
                  className="h-[72px] w-[96px] shrink-0 rounded-xl object-cover"
                />
                <span className="flex-1 text-[17px] font-bold text-[#1F2937]">
                  {label}
                </span>
                <ChevronRight className="h-[20px] w-[20px] shrink-0 text-[#1F2937]" strokeWidth={2.5} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}