"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Leaf, Hand, ShieldCheck, Minus, Plus, Truck } from "lucide-react";
import { POPULAR_WEEK } from "@/data/popularThisWeek";

const SIZE_OPTIONS = ["500g", "1 Kg", "5kg"];

export default function PopularWeekDetailPage({ params }) {
  const { slug } = use(params);
  const product = POPULAR_WEEK.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState("1 Kg");
  const [quantity, setQuantity] = useState(2);

  if (!product) {
    return (
      <div className="w-full bg-[#F6F0E3] px-[20px] py-[24px] sm:px-[40px] md:px-[64px] lg:px-[96px] xl:px-[120px] xl:py-[48px]">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const total = (Number(product.price) * quantity).toFixed(0);
  const thumbnails = Array(4).fill(product.image);

  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[20px] sm:px-[40px] md:px-[64px] lg:px-[96px] xl:px-[120px] xl:py-[24px]">
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <Link href="/popular-this-week" className="hover:text-gray-700">Popular this week</Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">{product.name}</span>
      </div>

      <div className="mt-[20px] grid grid-cols-1 gap-[20px] sm:mt-[24px] lg:grid-cols-2 lg:gap-[24px]">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-white">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          <div className="mt-[16px] grid grid-cols-4 gap-[12px]">
            {thumbnails.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-[10px] bg-white">
                <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-[20px] rounded-[16px] bg-white p-[16px] sm:mt-[24px] sm:p-[20px] lg:p-[24px]">
            <h2 className="text-[16px] font-bold text-[#1F2937] sm:text-[17px] lg:text-[18px]">About The Product</h2>
            <p className="mt-[10px] text-[14px] leading-[1.6] text-gray-600">
              Our {product.name} are handpicked at peak ripeness from trusted local farms.
              They have a creamy texture and rich, buttery flavour perfect for healthy meals.
            </p>
            <div className="mt-[16px] flex flex-col gap-[10px] text-[14px] text-[#1F2937]">
              <p><span className="font-semibold">Storage:</span> Store at room temperature until ripe, then refrigerate</p>
              <p><span className="font-semibold">Shelf life:</span> 5-7 days</p>
              <p><span className="font-semibold">Tip:</span> To ripen faster, place in a paper bag with a banana</p>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-[20px] sm:p-[24px] lg:p-[32px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h1 className="text-[22px] font-extrabold text-[#1F2937] sm:text-[24px] lg:text-[28px]">{product.name}</h1>
            {product.badge && (
              <span className="rounded-full bg-[#E6F0E1] px-[12px] py-[4px] text-[13px] font-semibold text-[#3E5730]">
                {product.badge}
              </span>
            )}
          </div>

          <p className="mt-[12px] text-[14px] leading-[1.6] text-gray-600 sm:text-[15px]">
            Creamy, rich and perfectly ripe. Great for salads, sandwiches and more.
          </p>

          <div className="mt-[10px] flex items-center gap-[6px]">
            <div className="flex text-[#E3A008]">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="h-[15px] w-[15px]" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-[14px] font-semibold text-[#1F2937]">4.9</span>
            <span className="text-[14px] text-gray-500">(312 reviews)</span>
          </div>

          <div className="mt-[16px] flex flex-wrap items-center gap-[12px] text-[12px] text-gray-600 sm:gap-[20px] sm:text-[13px]">
            <span className="flex items-center gap-[6px]"><Leaf className="h-[15px] w-[15px]" /> Farm fresh</span>
            <span className="flex items-center gap-[6px]"><Hand className="h-[15px] w-[15px]" /> Handpicked</span>
            <span className="flex items-center gap-[6px]"><ShieldCheck className="h-[15px] w-[15px]" /> No preservatives</span>
          </div>

          <div className="mt-[24px] flex flex-wrap items-center justify-between gap-y-[6px] border-t border-gray-100 pt-[20px]">
            <span className="text-[13px] font-semibold text-[#1F2937] sm:text-[14px]">
              Pick buy option ({SIZE_OPTIONS.length} options available)
            </span>
            <span className="text-[13px] font-semibold text-[#C6672E] sm:text-[14px]">${product.price}.00/ltr</span>
          </div>

          <div className="mt-[12px] flex flex-wrap gap-[10px]">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-[10px] px-[14px] py-[8px] text-[13px] font-semibold sm:px-[20px] sm:py-[10px] sm:text-[14px] ${
                  selectedSize === size ? "bg-[#3E5730] text-white" : "bg-[#F6F0E3] text-[#1F2937]"
                }`}
              >
                {size}
              </button>
            ))}
            <button className="flex items-center gap-[6px] rounded-[10px] bg-[#F6F0E3] px-[14px] py-[8px] text-[13px] font-semibold text-[#1F2937] sm:px-[20px] sm:py-[10px] sm:text-[14px]">
              Custom
              <ChevronRight className="h-[14px] w-[14px] rotate-90" />
            </button>
          </div>

          <div className="mt-[20px] flex flex-wrap items-center justify-between gap-y-[12px] rounded-[14px] bg-[#F6F0E3] p-[16px] sm:p-[20px]">
            <div>
              <p className="text-[13px] font-semibold text-gray-600">Order quantity</p>
              <div className="mt-[8px] flex items-center gap-[16px]">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white">
                  <Minus className="h-[16px] w-[16px]" />
                </button>
                <span className="text-[16px] font-bold text-[#1F2937]">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white">
                  <Plus className="h-[16px] w-[16px]" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-gray-600">Total <sup className="text-[10px]">MXN</sup></p>
              <p className="text-[22px] font-extrabold text-[#1F2937] sm:text-[24px]">${total}</p>
              <p className="text-[12px] text-gray-500">${product.price}.00/g</p>
            </div>
          </div>

          <button className="mt-[20px] w-full rounded-[12px] bg-[#3E5730] py-[16px] text-[16px] font-semibold text-white">
            Add to cart
          </button>

          <div className="mt-[12px] flex flex-wrap items-center gap-[10px] rounded-[12px] bg-[#E6F0E1] px-[16px] py-[12px] text-[13px] font-semibold text-[#3E5730]">
            <Truck className="h-[16px] w-[16px]" />
            Order in the next 2h 15m to get delivered tomorrow
          </div>
        </div>
      </div>
    </div>
  );
}