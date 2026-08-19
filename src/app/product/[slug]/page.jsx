"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Leaf, Hand, ShieldCheck, Minus, Plus, Truck } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/categories";
import { PRODUCTS } from "@/data/product";

const SIZE_OPTIONS = ["500g", "1 Kg", "5kg"];

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState("1 Kg");
  const [quantity, setQuantity] = useState(2);

  const thumbnails = product?.gallery ?? Array(4).fill(product?.image);
  const [activeImage, setActiveImage] = useState(product?.image);

  if (!product) {
    return (
      <div className="w-full bg-[#F6F0E3] px-[120px] py-[48px]">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[product.category] ?? "Products";
  const total = (Number(product.price) * quantity).toFixed(0);

  return (
    <div className="w-full bg-[#F6F0E3] px-[120px] py-[24px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <Link href="/groceries" className="hover:text-gray-700">Shop by department</Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <Link href={`/products/${product.category}`} className="hover:text-gray-700">{categoryLabel}</Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">{product.name}</span>
      </div>

      <div className="mt-[24px] grid grid-cols-2 gap-[24px]">
        {/* Left: image gallery */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-white">
            <Image src={activeImage} alt={product.name} fill className="object-cover" />
          </div>

          <div className="mt-[16px] grid grid-cols-4 gap-[12px]">
            {thumbnails.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square overflow-hidden rounded-[10px] bg-white ${
                  activeImage === img ? "ring-2 ring-[#3E5730]" : ""
                }`}
              >
                <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-[24px] rounded-[16px] bg-white p-[24px]">
            <h2 className="text-[18px] font-bold text-[#1F2937]">About The Product</h2>
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

        {/* Right: purchase panel */}
        <div className="rounded-[16px] bg-white p-[32px]">
          <div className="flex items-center gap-[12px]">
            <h1 className="text-[28px] font-extrabold text-[#1F2937]">{product.name}</h1>
            {product.badge && (
              <span className="rounded-full bg-[#E6F0E1] px-[12px] py-[4px] text-[13px] font-semibold text-[#3E5730]">
                {product.badge}
              </span>
            )}
          </div>

          <p className="mt-[12px] text-[15px] leading-[1.6] text-gray-600">
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

          <div className="mt-[16px] flex items-center gap-[20px] text-[13px] text-gray-600">
            <span className="flex items-center gap-[6px]"><Leaf className="h-[15px] w-[15px]" /> Farm fresh</span>
            <span className="flex items-center gap-[6px]"><Hand className="h-[15px] w-[15px]" /> Handpicked</span>
            <span className="flex items-center gap-[6px]"><ShieldCheck className="h-[15px] w-[15px]" /> No preservatives</span>
          </div>

          <div className="mt-[24px] flex items-center justify-between border-t border-gray-100 pt-[20px]">
            <span className="text-[14px] font-semibold text-[#1F2937]">
              Pick buy option ({SIZE_OPTIONS.length} options available)
            </span>
            <span className="text-[14px] font-semibold text-[#C6672E]">
              ${product.price}.00/ltr
            </span>
          </div>

          <div className="mt-[12px] flex gap-[10px]">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-[10px] px-[20px] py-[10px] text-[14px] font-semibold ${
                  selectedSize === size
                    ? "bg-[#3E5730] text-white"
                    : "bg-[#F6F0E3] text-[#1F2937]"
                }`}
              >
                {size}
              </button>
            ))}
            <button className="flex items-center gap-[6px] rounded-[10px] bg-[#F6F0E3] px-[20px] py-[10px] text-[14px] font-semibold text-[#1F2937]">
              Custom
              <ChevronRight className="h-[14px] w-[14px] rotate-90" />
            </button>
          </div>

          <div className="mt-[20px] flex items-center justify-between rounded-[14px] bg-[#F6F0E3] p-[20px]">
            <div>
              <p className="text-[13px] font-semibold text-gray-600">Order quantity</p>
              <div className="mt-[8px] flex items-center gap-[16px]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white"
                >
                  <Minus className="h-[16px] w-[16px]" />
                </button>
                <span className="text-[16px] font-bold text-[#1F2937]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white"
                >
                  <Plus className="h-[16px] w-[16px]" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[13px] font-semibold text-gray-600">
                Total <sup className="text-[10px]">MXN</sup>
              </p>
              <p className="text-[24px] font-extrabold text-[#1F2937]">${total}</p>
              <p className="text-[12px] text-gray-500">${product.price}.00/g</p>
            </div>
          </div>

          <button className="mt-[20px] w-full rounded-[12px] bg-[#3E5730] py-[16px] text-[16px] font-semibold text-white">
            Add to cart
          </button>

          <div className="mt-[12px] flex items-center gap-[10px] rounded-[12px] bg-[#E6F0E1] px-[16px] py-[12px] text-[13px] font-semibold text-[#3E5730]">
            <Truck className="h-[16px] w-[16px]" />
            Order in the next 2h 15m to get delivered tomorrow
          </div>
        </div>
      </div>
    </div>
  );
}