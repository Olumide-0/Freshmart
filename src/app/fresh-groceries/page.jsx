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

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function FreshGroceriesPage() {
  const [toast, setToast] = useState(false);

  const handleAddToCart = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-5 sm:px-8 md:px-12  xl:py-6">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-32px)] max-w-[360px] flex-col overflow-hidden rounded-[14px] bg-white shadow-xl sm:right-6 sm:top-6">
          <div className="flex items-center justify-between px-4 py-4 sm:px-5 sm:py-[18px]">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3E5730]">
                <CheckCircle2
                  className="h-4 w-4 text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </span>

              <span className="truncate text-[15px] font-bold text-[#1F2937] sm:text-[17px]">
                Added to cart
              </span>
            </div>

            <button
              onClick={() => setToast(false)}
              aria-label="Close"
              className="shrink-0"
            >
              <X
                className="h-5 w-5 text-[#1F2937]"
                strokeWidth={2}
              />
            </button>
          </div>

          <div className="h-[6px] w-full bg-[#3E5730]" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 sm:gap-2 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <span className="font-semibold text-[#C6672E]">
          Fresh groceries
        </span>
      </div>

      <h1 className="mt-4 text-[22px] font-extrabold text-[#1F2937] sm:mt-5 sm:text-[26px]">
        Fresh groceries
      </h1>

      {/* Product Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
        {FRESH_GROCERIES.map((product, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col overflow-hidden rounded-[12px] bg-white sm:rounded-[14px]"
          >
            {/* Image */}
            <div className="relative">
              <Link
                href={`/fresh-grocery-product/${product.slug}`}
                className="relative block aspect-square w-full"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover"
                />

                {product.badge && (
                  <span
                    className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:bottom-3 sm:left-3 sm:px-3 sm:py-1 sm:text-[12px] ${BADGE_STYLES[product.badge]}`}
                  >
                    {product.badge}
                  </span>
                )}
              </Link>

              {/* Heart */}
              <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white sm:right-3 sm:top-3">
                <Heart
                  className="h-[14px] w-[14px] text-[#C6672E] sm:h-[15px] sm:w-[15px]"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4">
              <Link href={`/fresh-grocery-product/${product.slug}`}>
                <h3 className="line-clamp-2 text-[14px] font-bold leading-[1.3] text-[#1F2937] hover:underline sm:text-[16px]">
                  {product.name}
                </h3>
              </Link>

              <p className="mt-1 text-[11px] text-gray-500 sm:mt-[2px] sm:text-[13px]">
                1g
              </p>

              {/* Rating */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1 sm:mt-[6px] sm:gap-[6px]">
                <div className="flex shrink-0 text-[#E3A008]">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3 w-3 sm:h-[13px] sm:w-[13px]"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                <span className="text-[10px] text-gray-500 sm:text-[13px]">
                  4.9 (312)
                </span>
              </div>

              {/* Price */}
              <div className="mt-2 flex flex-wrap items-baseline gap-1 sm:mt-2 sm:gap-[6px]">
                <span className="text-[17px] font-extrabold text-[#1F2937] sm:text-[20px]">
                  ${product.price}
                </span>

                <sup className="text-[8px] font-semibold text-[#1F2937] sm:text-[10px]">
                  MXN
                </sup>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#3E5730] py-2.5 text-[12px] font-semibold text-white sm:mt-[14px] sm:py-[10px] sm:text-[14px]"
              >
                {product.cta === "add" ? (
                  <>
                    <Plus
                      className="h-3.5 w-3.5"
                      strokeWidth={2.5}
                    />
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

