"use client";

import { useState } from "react";
import Image from "next/image";
import produce from "../../assets/image/Frame 88.png";
import bakery from "../../assets/image/Frame 89.png";
import frozen from "../../assets/image/Frame 90.png";
import meat from "../../assets/image/Frame 91.png";
import dairy from "../../assets/image/Frame 92.png";
import orange from "../../assets/image/image 55.png";
import cucumber from "../../assets/image/image 85.png";
import categories from "../../assets/image/Frame 92 (2).png";
import snacks from "../../assets/image/Frame 94.png";

import { ArrowRight, X, ChevronRight, LayoutGrid } from "lucide-react";

const DEPARTMENTS = [
  { label: "Fresh Produce", image: produce },
  { label: "Bakery", image: bakery },
  { label: "Frozen Foods", image: frozen },
  { label: "Meat & Sea Foods", image: meat },
  { label: "Dairy & Eggs", image: dairy },
  { label: "Snacks", image: snacks },
];

const ALL_CATEGORIES = [
  { label: "Fresh Produce", image: produce },
  { label: "Bakery", image: bakery },
  { label: "Frozen foods", image: frozen },
  { label: "Meat & seafood", image: meat },
  { label: "Dairy & Eggs", image: dairy },
  { label: "Beverages", image: orange },
  { label: "Fruits", image: cucumber },
];

export default function Second() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-[#F6F0E3] -mt-10 px-[20px] py-[36px] sm:px-[40px] sm:py-[44px] md:px-[64px] md:py-[56px]  xl:py-[68px]">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 cursor-pointer text-[14px] font-semibold text-[#3E5730] sm:text-[15px] lg:text-[16px]"
        >
          View All
          <span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </span>
        </button>
      </div>

      <div className="mt-[20px] grid grid-cols-3 gap-[10px] sm:mt-[24px] sm:grid-cols-4 sm:gap-[12px] md:grid-cols-5 lg:grid-cols-6 lg:gap-[16px] xl:mt-[28px] xl:grid-cols-7">
        {/* All categories tile */}
        <button
  onClick={() => setOpen(true)}
  className="flex w-full"
>
  <Image
    src={categories}
    alt="All categories"
    className="w-full object-contain cursor-pointer"
  />
</button>

        {DEPARTMENTS.map(({ label, image }) => (
          <div
            key={label}
            className=""
          >
            <Image
              src={image}
              alt={label}
              className=" w-full  object-cover"
            />
            
          </div>
        ))}
      </div>

      {/* Sidebar modal */}
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/45"
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 mt-15 h-[85%] w-full max-w-[560px] transform rounded-tl-xl rounded-bl-xl bg-white px-[20px] py-[24px] shadow-2xl transition-transform duration-300 sm:px-[28px] sm:py-[28px] md:px-[40px] md:py-[36px] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[22px]  font-extrabold text-[#1F2937] sm:text-[26px] md:text-[30px]">
              All Categories
            </h2>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-[22px] w-[22px] text-[#1F2937] sm:h-[26px] sm:w-[26px]" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-[20px] flex h-[calc(100%-90px)] flex-col gap-[12px] overflow-y-auto pr-[10px] sm:mt-[24px] sm:gap-[16px] md:mt-[28px]">
            {ALL_CATEGORIES.map(({ label, image }) => (
              
               <a key={label}
                href="#"
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}