import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import hero from "../../assets/image/Group 47.png";

const STATS = [
  { value: "500+", label: "Local farms & producers" },
  { value: "60 Min", label: "Average delivery time" },
  { value: "4.9", label: "From 15,000 shoppers", icon: Star },
];

export default function Hero() {
  return (
    <div>
      <div className="relative -my-15 h-[560px] sm:h-[600px] md:h-[640px] lg:h-[700px] xl:h-[760px]">
        <Image src={hero} alt="" fill className="object-cover" />
        {/* Content */}
        <div className="absolute inset-0 flex items-center px-[20px] sm:px-[40px] md:px-[64px] ">
          <div>
            <div className="flex flex-col gap-[18px] sm:gap-[24px] lg:gap-[34px]">
              <h1 className="text-[32px] font-bold leading-[1.15] sm:text-[42px] md:text-[52px] lg:text-[64px]">
                <span className="block text-[#3E5730]">Fresh Groceries,</span>
                <span className="block text-[#1F2937]">
                  thoughtfully delivered
                </span>
              </h1>

              <p className="mb-[16px] w-full text-[14px] leading-[1.6] text-[#1F2937] sm:w-[85%] sm:text-[15px] md:mb-[24px] md:w-[70%] lg:w-[60%] lg:text-[16px]">
                Shop fresh produce, pantry essentials and local favorites
                delivered to your door with care.
              </p>
            </div>

            <div className="mb-[32px] flex flex-col items-stretch gap-[12px] sm:flex-row sm:items-center sm:gap-[16px] lg:mb-[64px]">
              <Link
                href="/groceries"
                className="rounded-[10px] bg-[#3E5730] px-[28px] py-[12px] text-center text-[14px] font-semibold text-white sm:px-[40px] sm:py-[14px] sm:text-[15px] lg:px-[60px] lg:py-[16px] lg:text-[16px] cursor-pointer"
              >
                Shop Groceries
              </Link>
              <button className="rounded-[10px] border-[1.5px] border-[#3E5730] px-[28px] py-[12px] text-[14px] font-semibold text-[#3E5730] sm:px-[40px] sm:py-[14px] sm:text-[15px] lg:px-[60px] lg:py-[16px] lg:text-[16px] cursor-pointer">
                Weekly Deals
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-[28px] gap-y-[16px] sm:gap-x-[40px] lg:flex-nowrap lg:gap-[56px]">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center gap-[6px] text-[18px] font-extrabold text-[#3E5730] sm:text-[22px] lg:text-[26px]">
                    <span>{value}</span>
                    {Icon && (
                      <Icon
                        className="h-[16px] w-[16px] fill-[#3F5632] text-[#3E5730] sm:h-[18px] sm:w-[18px] lg:h-[20px] lg:w-[20px]"
                        strokeWidth={0}
                      />
                    )}
                  </div>
                  <p className="mt-[4px] text-[13px] text-[#161D27] sm:text-[14px] lg:text-[16px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}