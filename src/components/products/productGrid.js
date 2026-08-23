"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Plus, CheckCircle2, X } from "lucide-react";

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function ProductGrid({ products, basePath = "/product" }) {
  const [toast, setToast] = useState(false);

  const handleAddToCart = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  if (!products.length) {
    return (
      <p className="mt-[40px] text-gray-500">
        No products in this category yet.
      </p>
    );
  }

  return (
    <>
      {/* Toast */}
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

      <div className="mt-[24px] grid grid-cols-5 gap-[20px]">
        {products.map((product, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-[14px] bg-white">
            <Link href={product.slug ? `${basePath}/${product.slug}` : "#"} className="relative block aspect-square w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute bottom-[12px] left-[12px] rounded-full px-[12px] py-[4px] text-[12px] font-semibold ${BADGE_STYLES[product.badge]}`}
                >
                  {product.badge}
                </span>
              )}
            </Link>
            <button className="absolute right-[12px] top-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white">
              <Heart className="h-[15px] w-[15px] text-[#C6672E]" strokeWidth={2} />
            </button>

            <div className="flex flex-1 flex-col px-[16px] py-[16px]">
              <Link href={product.slug ? `${basePath}/${product.slug}` : "#"}>
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
    </>
  );
}