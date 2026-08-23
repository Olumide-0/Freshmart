"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Star, CheckCircle2, X } from "lucide-react";
import produceBasket from "../../assets/image/image 74.png";
import juices from "../../assets/image/image 77.png";
import berries from "../../assets/image/image 79.png";
import { POPULAR } from "@/data/popular";

export default function Popular() {
  const [toast, setToast] = useState(false);

  const handleAddToCart = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#F6F0E3] px-[120px] py-[40px]">
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

      <div className="grid grid-cols-2 gap-[24px]">
        {/* Popular this week */}
        <div className="rounded-[24px] bg-[#FCFAF5] p-[36px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[26px] font-extrabold text-[#1F2937]">
                Popular this week
              </h2>
              <p className="mt-[8px] max-w-[420px] text-[15px] leading-[1.5] text-[#4C545F]">
                What other shoppers are adding to their carts right now.
              </p>
            </div>
            <Link
              href="/popular-this-week"
              className="flex shrink-0 items-center gap-2 text-[16px] font-semibold text-[#3E5730]"
            >
              View All
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>

          <div className="mt-[28px] grid grid-cols-3 gap-[20px]">
            {POPULAR.map(({ name, weight, rating, reviews, price, image, liked, slug }, i) => (
              <div key={i} className="flex flex-col rounded-2xl bg-white p-[16px] shadow-sm">
                <Link href={`/popular-product/${slug}`} className="relative block">
                  <Image src={image} alt={name} className="h-[190px] w-full rounded-xl object-cover" />
                </Link>
                <button
                  aria-label="Favorite"
                  className="absolute right-[8px] top-[8px] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white shadow"
                >
                  <Heart
                    className={`h-[18px] w-[18px] ${liked ? "fill-[#C42A2E] text-[#C42A2E]" : "text-[#C42A2E]"}`}
                    strokeWidth={2}
                  />
                </button>

                <Link href={`/popular-product/${slug}`}>
                  <p className="mt-[16px] text-[17px] font-bold text-[#1F2937] hover:underline">{name}</p>
                </Link>
                <p className="mt-[6px] text-[15px] text-[#4C545F]">{weight}</p>

                <div className="mt-[8px] flex items-center gap-[6px]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-[14px] w-[14px] fill-[#D89B4A] text-[#D89B4A]" />
                  ))}
                  <span className="text-[14px] text-[#8F949B]">{rating} ({reviews})</span>
                </div>

                <div className="mt-[14px] flex items-baseline gap-[6px]">
                  <span className="text-[24px] font-extrabold text-[#1F2937]">{price}</span>
                  <span className="text-[13px] text-[#8F949B]">MXN</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-[16px] rounded-[10px] bg-[#3F5632] py-[12px] text-[15px] font-semibold text-white"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's deals — unchanged */}
        <div className="rounded-[24px] bg-[#FCFAF5] p-[36px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[26px] font-extrabold text-[#1F2937]">
                Today&rsquo;s deals
              </h2>
              <p className="mt-[8px] max-w-[380px] text-[15px] leading-[1.5] text-[#4C545F]">
                Lorem ipsum dolor sit amet consectetur. Ac lectus mattis.
              </p>
            </div>
            <button className="flex shrink-0 items-center gap-2 text-[16px] font-semibold text-[#3E5730]">
              View All
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>

          <div className="relative mt-[28px] flex h-[280px] items-center overflow-hidden rounded-2xl bg-[#EBCFBF] px-[36px]">
            <div className="relative z-10 max-w-[260px]">
              <h3 className="text-[26px] font-extrabold leading-[1.2] text-[#1F2937]">
                Up to 30% off on fresh produce
              </h3>
              <p className="mt-[14px] text-[15px] text-[#4C545F]">Limited time offer</p>
              <button className="mt-[20px] rounded-[10px] bg-[#BF6535] px-[24px] py-[12px] text-[15px] font-semibold text-white">
                Shop Now
              </button>
            </div>
            <Image
              src={produceBasket}
              alt="Fresh produce basket"
              className="absolute right-0 top-1/2 h-full w-auto -translate-y-1/2 object-contain"
            />
          </div>

          <div className="mt-[20px] grid grid-cols-2 gap-[20px]">
            <div className="relative flex h-[150px] items-end justify-end overflow-hidden rounded-2xl bg-[#F9F0EA]">
              <Image src={berries} alt="Organic berries" className="relative h-[130px] w-auto object-contain" />
              <div className="absolute inset-0 p-[20px]">
                <span className="text-[16px] font-bold text-[#BF6535]">20% OFF</span>
                <p className="mt-[18px] text-[22px] font-extrabold leading-[1.2] text-[#1F2937]">
                  Organic <br />Berries
                </p>
              </div>
            </div>

            <div className="relative flex h-[150px] items-end justify-end overflow-hidden rounded-2xl bg-[#F9F0EA]">
              <Image src={juices} alt="Cold-pressed juices" className="relative h-[150px] w-auto object-contain" />
              <div className="absolute inset-0 p-[20px]">
                <span className="text-[16px] font-bold text-[#BF6535]">20% OFF</span>
                <p className="mt-[18px] text-[22px] font-extrabold leading-[1.2] text-[#1F2937]">
                  Cold-Pressed <br /> Juices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}