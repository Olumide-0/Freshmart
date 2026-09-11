"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Star,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { PRODUCTS } from "@/data/product";
import { useCartStore } from "@/store/useCartStore";

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function Categories() {
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
    <div className="bg-[#F6F0E3] px-4 sm:px-6 md:px-12 lg:px-16  py-6 sm:py-8 md:py-[48px]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[100] flex w-[calc(100vw-32px)] sm:w-[360px] flex-col overflow-hidden rounded-[14px] bg-white shadow-xl transition-all">
          <div className="flex items-center justify-between px-4 sm:px-[20px] py-3.5 sm:py-[18px]">
            <div className="flex items-center gap-2.5 sm:gap-[12px]">
              <span className="flex h-6 w-6 sm:h-[28px] sm:w-[28px] items-center justify-center rounded-full bg-[#3E5730]">
                <CheckCircle2
                  className="h-3.5 w-3.5 sm:h-[16px] sm:w-[16px] text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </span>
              <span className="text-base sm:text-[17px] font-bold text-[#1F2937]">
                Added to cart
              </span>
            </div>
            <button onClick={() => setToast(false)} aria-label="Close">
              <X className="h-5 w-5 text-[#1F2937]" strokeWidth={2} />
            </button>
          </div>
          <div className="h-[6px] w-full bg-[#3E5730]" />
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#1F2937]">
            All categories
          </h1>
          <p className="mt-1 sm:mt-[6px] text-xs sm:text-[14px] text-gray-500">
            Showing 1-{PRODUCTS.length} of {PRODUCTS.length} products
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-[10px] text-xs sm:text-[14px]">
          <span className="text-gray-600">Sort by:</span>
          <button className="flex items-center gap-2 sm:gap-[10px] rounded-[8px] border border-gray-200 bg-white px-3 py-2 sm:px-[16px] sm:py-[10px] font-semibold text-[#1F2937]">
            Recommended
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Responsive Product Grid */}
      <div className="mt-5 sm:mt-[24px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-[20px]">
        {PRODUCTS.map((product, i) => (
          <div
            key={i}
            className="relative flex flex-col overflow-hidden rounded-[14px] bg-white transition-shadow hover:shadow-md"
          >
            {/* Image Container */}
            <Link
              href={`/product/${product.slug}`}
              className="relative block aspect-square w-full bg-gray-50"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute bottom-2 left-2 sm:bottom-[12px] sm:left-[12px] rounded-full px-2.5 py-1 sm:px-[12px] sm:py-[4px] text-[10px] sm:text-[12px] font-semibold ${
                    BADGE_STYLES[product.badge]
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </Link>

            {/* Favorite Button */}
            <button
              aria-label="Add to wishlist"
              className="absolute right-2 top-2 sm:right-[12px] sm:top-[12px] z-10 flex h-7 w-7 sm:h-[32px] sm:w-[32px] items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
            >
              <Heart
                className="h-3.5 w-3.5 sm:h-[15px] sm:w-[15px] text-[#C6672E]"
                strokeWidth={2}
              />
            </button>

            {/* Details Section */}
            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <Link href={`/product/${product.slug}`}>
                <h3 className="line-clamp-1 text-sm sm:text-[16px] font-bold text-[#1F2937] hover:underline">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-0.5 text-xs sm:text-[13px] text-gray-500">1g</p>

              {/* Ratings */}
              <div className="mt-1.5 sm:mt-[6px] flex items-center gap-1 sm:gap-[6px]">
                <div className="flex text-[#E3A008]">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3 w-3 sm:h-[13px] sm:w-[13px]"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-[13px] text-gray-500">
                  4.9 (312)
                </span>
              </div>

              {/* Price */}
              <div className="mt-2 sm:mt-[8px] flex items-baseline gap-1 sm:gap-[6px]">
                <span className="text-base sm:text-[20px] font-extrabold text-[#1F2937]">
                  ${product.price}
                </span>
                <sup className="text-[9px] sm:text-[10px] font-semibold text-[#1F2937]">
                  MXN
                </sup>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 sm:mt-[14px] flex w-full items-center justify-center gap-1 sm:gap-[6px] rounded-[8px] bg-[#3E5730] py-2 sm:py-[10px] text-xs sm:text-[14px] font-semibold text-white transition-colors hover:bg-[#324724] active:scale-[0.98]"
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

      {/* Responsive Pagination */}
      <div className="mt-8 sm:mt-[40px] flex items-center justify-center gap-1 sm:gap-[8px]">
        <button className="flex items-center gap-1 sm:gap-[6px] rounded-[8px] px-2 sm:px-[14px] py-2 sm:py-[10px] text-xs sm:text-[14px] font-medium text-gray-400 hover:text-gray-600">
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button className="flex h-8 w-8 sm:h-[38px] sm:w-[38px] items-center justify-center rounded-[8px] bg-[#3E5730] text-xs sm:text-[14px] font-semibold text-white">
          1
        </button>
        <button className="flex h-8 w-8 sm:h-[38px] sm:w-[38px] items-center justify-center rounded-[8px] text-xs sm:text-[14px] font-medium text-[#1F2937] hover:bg-black/5">
          2
        </button>
        <button className="flex h-8 w-8 sm:h-[38px] sm:w-[38px] items-center justify-center rounded-[8px] text-xs sm:text-[14px] font-medium text-[#1F2937] hover:bg-black/5">
          3
        </button>
        <span className="flex h-8 w-8 sm:h-[38px] sm:w-[38px] items-center justify-center text-xs sm:text-[14px] text-gray-400">
          ...
        </span>
        <button className="hidden xs:flex h-8 w-8 sm:h-[38px] sm:w-[38px] items-center justify-center rounded-[8px] text-xs sm:text-[14px] font-medium text-[#1F2937] hover:bg-black/5">
          67
        </button>
        <button className="flex h-8 w-8 sm:h-[38px] sm:w-[38px] items-center justify-center rounded-[8px] text-xs sm:text-[14px] font-medium text-[#1F2937] hover:bg-black/5">
          68
        </button>

        <button className="flex items-center gap-1 sm:gap-[6px] rounded-[8px] px-2 sm:px-[14px] py-2 sm:py-[10px] text-xs sm:text-[14px] font-medium text-[#1F2937] hover:bg-black/5">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}