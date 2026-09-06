"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  Leaf,
  Hand,
  ShieldCheck,
  Minus,
  Plus,
  Truck,
} from "lucide-react";
import { GROCERIES } from "@/data/groceries";

const SIZE_OPTIONS = ["500g", "1 Kg", "5kg"];

export default function GroceryDetailPage({ params }) {
  const { slug } = use(params);
  const product = GROCERIES.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState("1 Kg");
  const [quantity, setQuantity] = useState(2);

  if (!product) {
    return (
      <div className="w-full bg-[#F6F0E3] px-4 py-6 sm:px-8 md:px-12 lg:px-16 xl:px-[120px] xl:py-[48px]">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const total = (Number(product.price) * quantity).toFixed(0);
  const thumbnails = Array(4).fill(product.image);

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-5 sm:px-8 md:px-12   xl:py-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 sm:gap-2 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <Link href="/groceries" className="hover:text-gray-700">
          All categories
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <span className="max-w-[180px] truncate font-semibold text-[#C6672E] sm:max-w-none">
          {product.name}
        </span>
      </div>

      {/* Main Content */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-2 lg:gap-6">
        {/* Left */}
        <div className="min-w-0">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-white sm:rounded-[16px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
            {thumbnails.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square min-w-0 overflow-hidden rounded-[8px] bg-white sm:rounded-[10px]"
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 25vw, 12vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* About Product */}
          <div className="mt-5 rounded-[14px] bg-white p-4 sm:mt-6 sm:rounded-[16px] sm:p-5 lg:p-6">
            <h2 className="text-[16px] font-bold text-[#1F2937] sm:text-[18px]">
              About The Product
            </h2>

            <p className="mt-2.5 text-[13px] leading-[1.6] text-gray-600 sm:text-[14px]">
              Our {product.name} are handpicked at peak ripeness from trusted
              local farms. They have a creamy texture and rich, buttery
              flavour perfect for healthy meals.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-[#1F2937] sm:text-[14px]">
              <p>
                <span className="font-semibold">Storage:</span> Store at room
                temperature until ripe, then refrigerate
              </p>

              <p>
                <span className="font-semibold">Shelf life:</span> 5-7 days
              </p>

              <p>
                <span className="font-semibold">Tip:</span> To ripen faster,
                place in a paper bag with a banana
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="min-w-0 rounded-[14px] bg-white p-4 sm:rounded-[16px] sm:p-5 lg:p-6 xl:p-8">
          {/* Product Name */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="min-w-0 break-words text-[22px] font-extrabold text-[#1F2937] sm:text-[25px] lg:text-[28px]">
              {product.name}
            </h1>

            {product.badge && (
              <span className="shrink-0 rounded-full bg-[#E6F0E1] px-2.5 py-1 text-[12px] font-semibold text-[#3E5730] sm:px-3 sm:py-1 sm:text-[13px]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-2.5 text-[13px] leading-[1.6] text-gray-600 sm:mt-3 sm:text-[15px]">
            Creamy, rich and perfectly ripe. Great for salads, sandwiches and
            more.
          </p>

          {/* Rating */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-[10px]">
            <div className="flex text-[#E3A008]">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px]"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>

            <span className="text-[13px] font-semibold text-[#1F2937] sm:text-[14px]">
              4.9
            </span>

            <span className="text-[13px] text-gray-500 sm:text-[14px]">
              (312 reviews)
            </span>
          </div>

          {/* Features */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-600 sm:mt-4 sm:gap-x-5 sm:text-[13px]">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Leaf className="h-[14px] w-[14px] shrink-0 sm:h-[15px] sm:w-[15px]" />
              Farm fresh
            </span>

            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Hand className="h-[14px] w-[14px] shrink-0 sm:h-[15px] sm:w-[15px]" />
              Handpicked
            </span>

            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <ShieldCheck className="h-[14px] w-[14px] shrink-0 sm:h-[15px] sm:w-[15px]" />
              No preservatives
            </span>
          </div>

          {/* Buy Option */}
          <div className="mt-5 flex flex-col gap-1.5 border-t border-gray-100 pt-4 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:pt-5">
            <span className="text-[12px] font-semibold text-[#1F2937] sm:text-[14px]">
              Pick buy option ({SIZE_OPTIONS.length} options available)
            </span>

            <span className="text-[13px] font-semibold text-[#C6672E] sm:text-[14px]">
              ${product.price}.00/ltr
            </span>
          </div>

          {/* Size Options */}
          <div className="mt-2.5 flex flex-wrap gap-2 sm:mt-3 sm:gap-[10px]">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-[9px] px-3.5 py-2 text-[12px] font-semibold sm:rounded-[10px] sm:px-5 sm:py-2.5 sm:text-[14px] ${
                  selectedSize === size
                    ? "bg-[#3E5730] text-white"
                    : "bg-[#F6F0E3] text-[#1F2937]"
                }`}
              >
                {size}
              </button>
            ))}

            <button className="flex items-center gap-1.5 rounded-[9px] bg-[#F6F0E3] px-3.5 py-2 text-[12px] font-semibold text-[#1F2937] sm:rounded-[10px] sm:px-5 sm:py-2.5 sm:text-[14px]">
              Custom
              <ChevronRight className="h-[14px] w-[14px] rotate-90" />
            </button>
          </div>

          {/* Quantity + Total */}
          <div className="mt-4 flex flex-col gap-4 rounded-[12px] bg-[#F6F0E3] p-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:rounded-[14px] sm:p-5">
            <div>
              <p className="text-[12px] font-semibold text-gray-600 sm:text-[13px]">
                Order quantity
              </p>

              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="text-[15px] font-bold text-[#1F2937] sm:text-[16px]">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="text-left sm:text-right">
              <p className="text-[12px] font-semibold text-gray-600 sm:text-[13px]">
                Total <sup className="text-[9px] sm:text-[10px]">MXN</sup>
              </p>

              <p className="text-[22px] font-extrabold text-[#1F2937] sm:text-[24px]">
                ${total}
              </p>

              <p className="text-[11px] text-gray-500 sm:text-[12px]">
                ${product.price}.00/g
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          <button className="mt-4 w-full rounded-[11px] bg-[#3E5730] py-3.5 text-[15px] font-semibold text-white sm:mt-5 sm:rounded-[12px] sm:py-4 sm:text-[16px]">
            Add to cart
          </button>

          {/* Delivery */}
          <div className="mt-2.5 flex items-start gap-2 rounded-[11px] bg-[#E6F0E1] px-3.5 py-3 text-[12px] font-semibold leading-[1.4] text-[#3E5730] sm:items-center sm:gap-[10px] sm:rounded-[12px] sm:px-4 sm:text-[13px]">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />

            <span>
              Order in the next 2h 15m to get delivered tomorrow
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

