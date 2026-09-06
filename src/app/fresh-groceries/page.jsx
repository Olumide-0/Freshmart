"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Star,
  Plus,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { FRESH_GROCERIES } from "@/data/freshGroceries";
import { useCartStore } from "@/store/useCartStore";

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function FreshGroceriesPage() {
  const [toast, setToast] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (product) => {
    addItem({
      id: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      badge: product.badge,
    });
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-6 sm:px-8 sm:py-8 md:px-12 lg:px-16 xl:px-[120px] xl:py-[24px]">
      {toast && (
        <div className="fixed left-4 right-4 top-4 z-[100] flex flex-col overflow-hidden rounded-[14px] bg-white shadow-xl sm:left-auto sm:right-[24px] sm:top-[24px] sm:w-[360px]">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-[20px] sm:py-[18px]">
            <div className="flex items-center gap-2.5 sm:gap-[12px]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E5730] sm:h-[28px] sm:w-[28px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-white sm:h-[16px] sm:w-[16px]" strokeWidth={2.5} fill="none" />
              </span>
              <span className="text-base font-bold text-[#1F2937] sm:text-[17px]">Added to cart</span>
            </div>
            <button onClick={() => setToast(false)} aria-label="Close">
              <X className="h-5 w-5 text-[#1F2937]" strokeWidth={2} />
            </button>
          </div>
          <div className="h-[5px] w-full bg-[#3E5730] sm:h-[6px]" />
        </div>
      )}

      <div className="flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <span className="font-semibold text-[#C6672E]">
          Fresh groceries
        </span>
      </div>

      <h1 className="mt-3 text-xl font-extrabold text-[#1F2937] sm:mt-[16px] sm:text-2xl md:text-[26px]">
        Fresh groceries
      </h1>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-[20px]">
        {FRESH_GROCERIES.map((product, i) => (
          <div key={i} className="relative flex flex-col overflow-hidden rounded-[14px] bg-white shadow-sm transition-shadow hover:shadow-md">
            <Link href={`/fresh-grocery-product/${product.slug}`} className="relative block aspect-square w-full bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:bottom-[12px] sm:left-[12px] sm:px-[12px] sm:py-[4px] sm:text-[12px] ${BADGE_STYLES[product.badge]}`}
                >
                  {product.badge}
                </span>
              )}
            </Link>
            
            <button
              aria-label="Add to favorites"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 sm:right-[12px] sm:top-[12px] sm:h-[32px] sm:w-[32px]"
            >
              <Heart className="h-3.5 w-3.5 text-[#C6672E] sm:h-[15px] sm:w-[15px]" strokeWidth={2} />
            </button>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <Link href={`/fresh-grocery-product/${product.slug}`}>
                <h3 className="line-clamp-1 text-sm font-bold text-[#1F2937] hover:underline sm:text-[16px]">{product.name}</h3>
              </Link>
              <p className="mt-0.5 text-xs text-gray-500 sm:mt-[2px] sm:text-[13px]">1g</p>

              <div className="mt-1.5 flex items-center gap-1 sm:mt-[6px] sm:gap-[6px]">
                <div className="flex text-[#E3A008]">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Star key={idx} className="h-3 w-3 sm:h-[13px] sm:w-[13px]" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 sm:text-[13px]">4.9 (312)</span>
              </div>

              <div className="mt-2 flex items-baseline gap-1 sm:mt-[8px] sm:gap-[6px]">
                <span className="text-base font-extrabold text-[#1F2937] sm:text-[20px]">${product.price}</span>
                <sup className="text-[9px] font-semibold text-[#1F2937] sm:text-[10px]">MXN</sup>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#3E5730] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#324724] sm:mt-[14px] sm:gap-[6px] sm:py-[10px] sm:text-[14px]"
              >
                {product.cta === "add" ? (
                  <>
                    <Plus className="h-3.5 w-3.5 sm:h-[14px] sm:w-[14px]" strokeWidth={2.5} />
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

