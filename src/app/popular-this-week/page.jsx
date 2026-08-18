import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Plus, ChevronRight } from "lucide-react";
import avocado from "../../assets/image/image 67.png";
import milk from "../../assets/image/image 71.png";
import chicken from "../../assets/image/image 73.png";
import carrot from "../../assets/image/ImageContainer (2).png";
import cabbage from "../../assets/image/ImageContainer (1).png";
import tomatoes from "../../assets/image/image 110.png";
import mango from "../../assets/image/image 111.png";
import broccoli from "../../assets/image/Frame 88.png";

const PRODUCTS = [
  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: milk, name: "Milk", price: "42", cta: "cart" },
  { image: chicken, name: "Fresh Chicken wings", price: "42", cta: "cart" },
  { image: chicken, name: "Shrimps", badge: "Low in stock", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },

  { image: carrot, name: "Carrot", badge: "Low in stock", price: "42", cta: "cart" },
  { image: cabbage, name: "Cabbage", price: "42", cta: "cart" },
  { image: tomatoes, name: "Tomatoes", badge: "In season", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },

  { image: tomatoes, name: "Tomatoes", badge: "Low in stock", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { image: mango, name: "Fresh Mango", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: broccoli, name: "Broccoli", badge: "In season", price: "42", cta: "cart" },
];

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function PopularThisWeekPage() {
  return (
    <div className="w-full bg-[#F6F0E3] px-[120px] py-[24px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">Popular this week</span>
      </div>

      <h1 className="mt-[16px] text-[26px] font-extrabold text-[#1F2937]">
        Popular this week
      </h1>

      {/* Product grid */}
      <div className="mt-[24px] grid grid-cols-5 gap-[20px]">
        {PRODUCTS.map((product, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-[14px] bg-white">
            <div className="relative aspect-square w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
              />
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
    </div>
  );
}