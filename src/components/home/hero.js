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
      <div className="relative -my-10 ">
        <Image src={hero} alt="" className="w-full h-full object-fit" />
        {/* Content */}
        <div className="absolute inset-0 flex  items-center px-[120px]">
          <div>
            <div className="flex flex-col gap-[34px]">
              <h1 className="text-[64px] font-bold leading-[1.15] ">
                <span className="block text-[#3E5730]">Fresh Groceries,</span>
                <span className="block text-[#1F2937]">
                  thoughtfully delivered
                </span>
              </h1>

              <p className="w-[60%] mb-[24px] text-[16px] leading-[1.6] text-[#1F2937]">
                Shop fresh produce, pantry essentials and local favorites
                delivered to your door with care.
              </p>
            </div>

            <div className="mb-[64px] flex items-center gap-[16px]">
              <Link
                href="/groceries"
                className="rounded-[10px] bg-[#3E5730] px-[60px] py-[16px] text-[16px] font-semibold text-white text-center"
              >
                Shop Groceries
              </Link>
              <button className="rounded-[10px] border-[1.5px] border-[#3E5730] px-[60px] py-[16px] text-[16px] font-semibold text-[#3E5730]">
                Weekly Deals
              </button>
            </div>

            <div className="flex items-center gap-[56px]">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center gap-[6px] text-[26px] font-extrabold text-[#3E5730]">
                    <span>{value}</span>
                    {Icon && (
                      <Icon
                        className="h-[20px] w-[20px] fill-[#3F5632] text-[#3E5730]"
                        strokeWidth={0}
                      />
                    )}
                  </div>
                  <p className="mt-[4px] text-[16px] text-[#161D27]">
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