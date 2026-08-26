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
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[24px] sm:px-[40px] sm:py-[28px] md:px-[64px] md:py-[32px]  xl:py-[40px]">
      {/* Toast */}
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

      <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-2 xl:gap-[24px]">
        {/* Popular this week */}
        <div className="rounded-[24px] bg-[#FCFAF5] p-[20px] sm:p-[28px] ">
          <div className="flex flex-wrap items-start justify-between gap-y-[12px]">
            <div>
              <h2 className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
                Popular this week
              </h2>
              <p className="mt-[8px] max-w-[420px] text-[14px] leading-[1.5] text-[#4C545F] sm:text-[15px]">
                What other shoppers are adding to their carts right now.
              </p>
            </div>
            <Link
              href="/popular-this-week"
              className="flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[#3E5730] sm:text-[15px] lg:text-[16px]"
            >
              View All
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
          </div>

          <div className="mt-[20px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 lg:gap-[8px] xl:mt-[28px]">
            {POPULAR.map(({ name, weight, rating, reviews, price, image, liked, slug }, i) => (
              <div key={i} className="relative flex flex-col rounded-2xl bg-white p-[16px] shadow-sm">
                <Link href={`/popular-product/${slug}`} className="relative block">
                  <Image
                    src={image}
                    alt={name}
                    className="h-[150px] w-full rounded-xl object-cover sm:h-[170px] lg:h-[190px]"
                  />
                </Link>
                <button
                  aria-label="Favorite"
                  className="absolute right-[8px] top-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white shadow sm:h-[38px] sm:w-[38px]"
                >
                  <Heart
                    className={`h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] ${liked ? "fill-[#C42A2E] text-[#C42A2E]" : "text-[#C42A2E]"}`}
                    strokeWidth={2}
                  />
                </button>

                <Link href={`/popular-product/${slug}`}>
                  <p className="mt-[16px] text-[15px] font-bold text-[#1F2937] hover:underline sm:text-[16px] lg:text-[17px]">{name}</p>
                </Link>
                <p className="mt-[6px] text-[13px] text-[#4C545F] sm:text-[14px] lg:text-[15px]">{weight}</p>

                <div className="mt-[8px] flex items-center gap-[6px]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-[14px] w-[14px] fill-[#D89B4A] text-[#D89B4A]" />
                  ))}
                  <span className="text-[12px] text-[#8F949B] sm:text-[13px] lg:text-[14px]">{rating} ({reviews})</span>
                </div>

                <div className="mt-[14px] flex items-baseline gap-[6px]">
                  <span className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] lg:text-[24px]">{price}</span>
                  <span className="text-[12px] text-[#8F949B] sm:text-[13px]">MXN</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-[16px] rounded-[10px] bg-[#3F5632] py-[10px] text-[13px] font-semibold text-white sm:py-[12px] sm:text-[14px] lg:text-[15px]"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's deals — unchanged */}
        <div className="rounded-[24px] bg-[#FCFAF5] p-[20px] sm:p-[28px] ">
          <div className="flex flex-wrap items-start justify-between gap-y-[12px]">
            <div>
              <h2 className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
                Today&rsquo;s deals
              </h2>
              <p className="mt-[8px] max-w-[380px] text-[14px] leading-[1.5] text-[#4C545F] sm:text-[15px]">
                Lorem ipsum dolor sit amet consectetur. Ac lectus mattis.
              </p>
            </div>
            <button className="flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[#3E5730] sm:text-[15px] lg:text-[16px]">
              View All
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="relative mt-[20px] flex h-[200px] items-center overflow-hidden rounded-2xl bg-[#EBCFBF] px-[20px] sm:h-[230px] sm:px-[28px] md:h-[260px] lg:h-[280px] lg:px-[36px] xl:mt-[28px]">
            <div className="relative z-10 max-w-[60%] sm:max-w-[260px]">
              <h3 className="text-[18px] font-extrabold leading-[1.2] text-[#1F2937] sm:text-[20px] md:text-[23px] lg:text-[26px]">
                Up to 30% off on fresh produce
              </h3>
              <p className="mt-[14px] text-[13px] text-[#4C545F] sm:text-[14px] lg:text-[15px]">Limited time offer</p>
              <button className="mt-[20px] rounded-[10px] bg-[#BF6535] px-[18px] py-[10px] text-[13px] font-semibold text-white sm:px-[24px] sm:py-[12px] sm:text-[14px] lg:text-[15px]">
                Shop Now
              </button>
            </div>
            <Image
              src={produceBasket}
              alt="Fresh produce basket"
              className="absolute right-0 top-1/2 h-full w-auto -translate-y-1/2 object-contain"
            />
          </div>

          <div className="mt-[16px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[16px] lg:gap-[20px] xl:mt-[20px]">
            <div className="relative flex h-[130px] items-end justify-end overflow-hidden rounded-2xl bg-[#F9F0EA] sm:h-[140px] lg:h-[150px]">
              <Image
                src={berries}
                alt="Organic berries"
                className="relative h-[110px] w-auto object-contain sm:h-[120px] lg:h-[130px]"
              />
              <div className="absolute inset-0 p-[14px] sm:p-[16px] lg:p-[20px]">
                <span className="text-[13px] font-bold text-[#BF6535] sm:text-[14px] lg:text-[16px]">20% OFF</span>
                <p className="mt-[10px] text-[16px] font-extrabold leading-[1.2] text-[#1F2937] sm:mt-[14px] sm:text-[18px] lg:mt-[18px] lg:text-[22px]">
                  Organic <br />Berries
                </p>
              </div>
            </div>

            <div className="relative flex h-[130px] items-end justify-end overflow-hidden rounded-2xl bg-[#F9F0EA] sm:h-[140px] lg:h-[150px]">
              <Image
                src={juices}
                alt="Cold-pressed juices"
                className="relative h-[130px] w-auto object-contain sm:h-[140px] lg:h-[150px]"
              />
              <div className="absolute inset-0 p-[14px] sm:p-[16px] lg:p-[20px]">
                <span className="text-[13px] font-bold text-[#BF6535] sm:text-[14px] lg:text-[16px]">20% OFF</span>
                <p className="mt-[10px] text-[16px] font-extrabold leading-[1.2] text-[#1F2937] sm:mt-[14px] sm:text-[18px] lg:mt-[18px] lg:text-[22px]">
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