"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GROCERIES_TEASER } from "@/data/groceriesTeaser";

export default function Fourth() {
  return (
    <div className="w-full bg-[#F6F0E3] px-[120px] py-[68px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#1F2937]">
            Fresh groceries You Need
          </h2>
          <p className="mt-[8px] max-w-[520px] text-[15px] leading-[1.5] text-[#4C545F]">
            What&rsquo;s being harvested right now, at its best — picked and
            delivered within days.
          </p>
        </div>
        <Link
          href="/fresh-groceries"
          className="flex shrink-0 items-center gap-2 text-[16px] font-semibold text-[#3E5730]"
        >
          View All
          <ArrowRight className="h-6 w-6" />
        </Link>
      </div>

      <div className="mt-[28px] grid grid-cols-4 gap-[24px]">
        {GROCERIES_TEASER.map(({ title, subtitle, image, slug }, i) => (
          <Link
            key={i}
            href={`/groceries-teaser-product/${slug}`}
            className="relative flex h-[190px] flex-col justify-end overflow-hidden rounded-2xl"
          >
            <Image
              src={image}
              alt={title}
              className="absolute inset-0 h-[190px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="relative z-10 p-[20px]">
              <p className="text-[18px] font-bold leading-[1.2] text-white">
                {title}
              </p>
              <p className="mt-[2px] text-[14px] text-white/90">{subtitle}</p>

              <span className="mt-[16px] inline-block rounded-[10px] bg-white px-[20px] py-[10px] text-[15px] font-semibold text-[#3F5632]">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}