"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Plus, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, X } from "lucide-react";
import { GROCERIES } from "@/data/groceries";

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function Categories() {
  const [toast, setToast] = useState(false);

  const handleAddToCart = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="bg-[#F6F0E3] px-[120px] py-[48px]">
      {toast && (
        <div className="fixed right-[24px] top-[24px] z-[100] flex w-[360px] flex-col overflow-hidden rounded-[14px] bg-white shadow-xl">
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

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#1F2937]">All categories</h1>
          <p className="mt-[6px] text-[14px] text-gray-500">
            Showing 1-{GROCERIES.length} of {GROCERIES.length} products
          </p>
        </div>

        <div className="flex items-center gap-[10px] text-[14px]">
          <span className="text-gray-600">Sort by:</span>
          <button className="flex items-center gap-[10px] rounded-[8px] border border-gray-200 bg-white px-[16px] py-[10px] font-semibold text-[#1F2937]">
            Recommended
            <ChevronDown className="h-[16px] w-[16px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mt-[24px] grid grid-cols-5 gap-[20px]">
        {GROCERIES.map((product, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-[14px] bg-white">
            <Link href={`/groceries/${product.slug}`} className="relative block aspect-square w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
              />
              {product.badge && (
                <span className={`absolute bottom-[12px] left-[12px] rounded-full px-[12px] py-[4px] text-[12px] font-semibold ${BADGE_STYLES[product.badge]}`}>
                  {product.badge}
                </span>
              )}
            </Link>
            <button
              aria-label="Add to favorites"
              className="absolute right-[12px] top-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white"
            >
              <Heart className="h-[15px] w-[15px] text-[#C6672E]" strokeWidth={2} />
            </button>

            <div className="flex flex-1 flex-col px-[16px] py-[16px]">
              <Link href={`/groceries/${product.slug}`}>
                <h3 className="text-[16px] font-bold text-[#1F2937] hover:underline">{product.name}</h3>
              </Link>
              <p className="mt-[2px] text-[13px] text-gray-500">1g</p>

              <div className="mt-[6px] flex items-center gap-[6px]">
                <div className="flex text-[#E3A008]">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Star key={idx} className="h-[13px] w-[13px]" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[13px] text-gray-500">4.9 (312)</span>
              </div>

              <div className="mt-[8px] flex items-baseline gap-[6px]">
                <span className="text-[20px] font-extrabold text-[#1F2937]">${product.price}</span>
                <sup className="text-[10px] font-semibold text-[#1F2937]">MXN</sup>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-[14px] flex w-full items-center justify-center gap-[6px] rounded-[8px] bg-[#3E5730] py-[10px] text-[14px] font-semibold text-white"
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

      <div className="mt-[40px] flex items-center justify-center gap-[8px]">
        <button className="flex items-center gap-[6px] rounded-[8px] px-[14px] py-[10px] text-[14px] font-medium text-gray-400">
          <ChevronLeft className="h-[16px] w-[16px]" strokeWidth={2} />
          Previous
        </button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] bg-[#3E5730] text-[14px] font-semibold text-white">1</button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">2</button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">3</button>
        <span className="flex h-[38px] w-[38px] items-center justify-center text-[14px] text-gray-400">...</span>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">67</button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">68</button>
        <button className="flex items-center gap-[6px] rounded-[8px] px-[14px] py-[10px] text-[14px] font-medium text-[#1F2937]">
          Next
          <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}