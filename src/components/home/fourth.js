"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GROCERIES_TEASER } from "@/data/groceriesTeaser";

export default function Fourth() {
  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[36px] sm:px-[40px] sm:py-[44px] md:px-[64px] md:py-[56px]  xl:py-[68px]">
      <div className="flex flex-wrap items-start justify-between gap-y-[12px]">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
            Fresh groceries You Need
          </h2>
          <p className="mt-[8px] max-w-[520px] text-[14px] leading-[1.5] text-[#4C545F] sm:text-[15px]">
            What&rsquo;s being harvested right now, at its best — picked and
            delivered within days.
          </p>
        </div>
        <Link
          href="/fresh-groceries"
          className="flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[#3E5730] sm:text-[15px] lg:text-[16px]"
        >
          View All
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Link>
      </div>

      <div className="mt-[20px] grid grid-cols-2 gap-[14px] sm:mt-[24px] sm:gap-[18px] md:grid-cols-3 lg:grid-cols-4 lg:gap-[24px] xl:mt-[28px]">
        {GROCERIES_TEASER.map(({ title, subtitle, image, slug }, i) => (
          <Link
            key={i}
            href={`/groceries-teaser-product/${slug}`}
            className="relative flex h-[150px] flex-col justify-end overflow-hidden rounded-2xl sm:h-[165px] md:h-[178px] lg:h-[190px]"
          >
            <Image
              src={image}
              alt={title}
              className="absolute inset-0 h-[150px] w-full object-cover sm:h-[165px] md:h-[178px] lg:h-[190px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="relative z-10 p-[14px] sm:p-[16px] md:p-[18px] lg:p-[20px]">
              <p className="text-[15px] font-bold leading-[1.2] text-white sm:text-[16px] md:text-[17px] lg:text-[18px]">
                {title}
              </p>
              <p className="mt-[2px] text-[12px] text-white/90 sm:text-[13px] lg:text-[14px]">{subtitle}</p>

              <span className="mt-[10px] inline-block rounded-[10px] bg-white px-[14px] py-[8px] text-[12px] font-semibold text-[#3F5632] sm:mt-[12px] sm:px-[16px] sm:py-[9px] sm:text-[13px] md:mt-[14px] lg:mt-[16px] lg:px-[20px] lg:py-[10px] lg:text-[15px]">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}