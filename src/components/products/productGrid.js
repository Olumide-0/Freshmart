import Image from "next/image";
import { Heart, Star, Plus } from "lucide-react";

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <p className="mt-[40px] text-gray-500">
        No products in this category yet.
      </p>
    );
  }

  return (
    <div className=" grid grid-cols-5 gap-[20px]">
      {products.map((product, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-[14px] bg-white">
          <div className="relative aspect-square ">
            <Image src={product.image} alt={product.name} fill className=" object-cover" />
            <button className="absolute right-[12px] top-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white">
              <Heart className="h-[15px] w-[15px] text-[#C6672E]" strokeWidth={2} />
            </button>
            {product.badge && (
              <span
                className={`absolute bottom-[12px] left-[12px] rounded-full px-[12px] py-[4px] text-[12px] font-semibold ${BADGE_STYLES[product.badge]}`}
              >
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col px-[16px] py-[16px]">
            <h3 className="text-[16px] font-bold text-[#1F2937]">{product.name}</h3>
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

            <button className="mt-[14px] flex w-full items-center justify-center gap-[6px] rounded-[8px] bg-[#3E5730] py-[10px] text-[14px] font-semibold text-white">
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
  );
}