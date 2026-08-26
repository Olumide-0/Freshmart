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
    <div className="w-full bg-[#F6F0E3] -mt-10 px-[20px] py-[36px] sm:px-[40px] sm:py-[44px] md:px-[64px] md:py-[56px]  xl:py-[68px]">
      <div className=" relative z-[60] flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
          Shop by Occasion
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[14px] font-semibold text-[#3E5730] sm:text-[15px] lg:text-[16px] cursor-pointer"
        >
          View All
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="mt-[20px] grid grid-cols-2 gap-[14px] sm:mt-[24px] sm:gap-[18px] md:grid-cols-3 lg:grid-cols-4 lg:gap-[24px] xl:mt-[28px]">
        {OCCASIONS.map(({ label, slug, image }) => (
          <Link
            key={label}
            href={`/occasions/${slug}`}
            className="relative overflow-hidden rounded-2xl"
          >
            <Image
              src={image}
              alt={label}
              className="h-auto w-full"
            />
          </Link>
        ))}
      </div>

      {/* Sidebar modal */}
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/45" />

        <div
          className={`absolute right-0 top-0 mt-15 h-[80%] w-full max-w-[560px] transform rounded-tl-xl rounded-bl-xl bg-white px-[20px] py-[24px] shadow-2xl transition-transform duration-300 sm:px-[28px] sm:py-[28px] md:px-[40px] md:py-[36px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-extrabold text-[#1F2937] sm:text-[26px] md:text-[30px]">
              All Categories
            </h2>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-[22px] w-[22px] text-[#1F2937] sm:h-[26px] sm:w-[26px]" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-[20px] flex h-[calc(100%-90px)] flex-col gap-[12px] overflow-y-auto pr-[10px] sm:mt-[24px] sm:gap-[16px] md:mt-[28px]">
            {ALL_CATEGORIES.map(({ label, slug, image }) => (
              <Link
                key={label}
                href={`/occasions/${slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-[12px] rounded-2xl border border-[#F0D2A8] bg-white p-[10px] sm:gap-[16px]"
              >
                <Image
                  src={image}
                  alt={label}
                  className="h-[60px] w-[80px] shrink-0 rounded-xl object-cover sm:h-[72px] sm:w-[96px]"
                />
                <span className="flex-1 text-[15px] font-bold text-[#1F2937] sm:text-[17px]">
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