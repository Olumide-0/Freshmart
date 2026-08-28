"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Plus, ChevronRight, CheckCircle2, X } from "lucide-react";
import { POPULAR_WEEK } from "@/data/popularThisWeek";

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function PopularThisWeekPage() {
  const [toast, setToast] = useState(false);

  const handleAddToCart = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[20px] sm:px-[40px] md:px-[64px]  xl:py-[24px]">
      {toast && (
        <div className="fixed left-[16px] right-[16px] top-[16px] z-[100] flex w-auto flex-col overflow-hidden rounded-[14px] bg-white shadow-xl sm:left-auto sm:right-[24px] sm:top-[24px] sm:w-[360px]">
          <div className="flex items-center justify-between px-[20px] py-[18px]">
            <div className="flex items-center gap-[12px]">
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#3E5730]">
                <CheckCircle2 className="h-[16px] w-[16px] text-white" strokeWidth={2.5} fill="none" />
              </span>
              <span className="text-[17px] font-bold text-[#1F2937]">Added to cart</span>
            </div>
            <button onClick={() => setToast(false)} aria-label="Close">
              <X className="h-[20px] w-[20px] text-[#1F2937]" strokeWidth={2} />
            </button>
          </div>
          <div className="h-[6px] w-full bg-[#3E5730]" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">Popular this week</span>
      </div>

      <h1 className="mt-[16px] text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
        Popular this week
      </h1>

      <div className="mt-[20px] grid grid-cols-2 gap-[14px] sm:mt-[24px] sm:grid-cols-3 sm:gap-[16px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-[20px]">
        {POPULAR_WEEK.map((product, i) => (
          <div key={i} className="relative flex flex-col overflow-hidden rounded-[14px] bg-white">
            <Link href={`/popular-week-product/${product.slug}`} className="relative block aspect-square w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute bottom-[10px] left-[10px] rounded-full px-[10px] py-[3px] text-[11px] font-semibold sm:bottom-[12px] sm:left-[12px] sm:px-[12px] sm:py-[4px] sm:text-[12px] ${BADGE_STYLES[product.badge]}`}
                >
                  {product.badge}
                </span>
              )}
            </Link>
            <button className="absolute right-[12px] top-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white">
              <Heart className="h-[15px] w-[15px] text-[#C6672E]" strokeWidth={2} />
            </button>

            <div className="flex flex-1 flex-col px-[16px] py-[16px]">
              <Link href={`/popular-week-product/${product.slug}`}>
                <h3 className="text-[14px] font-bold text-[#1F2937] hover:underline sm:text-[15px] lg:text-[16px]">{product.name}</h3>
              </Link>
              <p className="mt-[2px] text-[12px] text-gray-500 sm:text-[13px]">1g</p>

              <div className="mt-[6px] flex items-center gap-[6px]">
                <div className="flex text-[#E3A008]">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Star key={idx} className="h-[13px] w-[13px]" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[12px] text-gray-500 sm:text-[13px]">4.9 (312)</span>
              </div>

              <div className="mt-[8px] flex items-baseline gap-[6px]">
                <span className="text-[17px] font-extrabold text-[#1F2937] sm:text-[18px] lg:text-[20px]">${product.price}</span>
                <sup className="text-[10px] font-semibold text-[#1F2937]">MXN</sup>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-[14px] flex w-full items-center justify-center gap-[6px] rounded-[8px] bg-[#3E5730] py-[8px] text-[12px] font-semibold text-white sm:py-[10px] sm:text-[14px]"
              >
                {product.cta === "add" ? (
                  <>
                    <Plus className="h-[14px] w-[14px]" strokeWidth={2.5} />
                    Add
                  </>
                ) : (
                  "Add to cart"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
