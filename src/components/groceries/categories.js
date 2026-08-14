import Image from "next/image"
import { Heart, Star, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import chicken from "../../assets/image/image 73.png";
import milk from "../../assets/image/image 71.png";
import oranges from "../../assets/image/image 191.png"
import sinamon from "../../assets/image/ImageContainer.png"
import pepper from "../../assets/image/image 109.png"
import tomatoes from "../../assets/image/image 110.png"
import mangoe from "../../assets/image/image 111.png"
import avocado from "../../assets/image/image 112.png"
import wings from "../../assets/image/image 118.png"
import watermelon from "../../assets/image/image 182.png"
import apples from "../../assets/image/image 185.png"
import bellpepper from "../../assets/image/image 189.png"
import cabbage from "../../assets/image/ImageContainer (1).png"
import donut from "../../assets/image/ImageContainer (2).png"

const PRODUCTS = [
  { image: watermelon, name: "Watermelon", badge: null, price: "42", cta: "cart" },
  { image: mangoe, name: "Fresh Mango", badge: null, price: "42", cta: "cart" },
  { image: wings, name: "Fresh Chicken wings", badge: null, price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", badge: null, price: "42", cta: "cart" },
  { image: bellpepper, name: "Bell pepper", badge: null, price: "42", cta: "add" },

  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: cabbage, name: "Cabbage", badge: null, price: "42", cta: "cart" },
  { image: tomatoes, name: "Tomatoes", badge: "In season", price: "42", cta: "cart" },
  { image: chicken, name: "Shrimps", badge: "Low in stock", price: "42", cta: "cart" },
  { image: pepper, name: "Organic Avocado", badge: null, price: "42", cta: "cart" },

  { image: donut, name: "Carrot", badge: "Off season", price: "42", cta: "cart" },
  { image: milk, name: "Milk", badge: null, price: "42", cta: "cart" },
  { image: apples, name: "Organic Apples", badge: null, price: "42", cta: "add" },
  { image: oranges, name: "Oranges", badge: "In season", price: "42", cta: "cart" },
  { image: sinamon, name: "Organic Avocado", badge: null, price: "42", cta: "cart" },
]

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
}

export default function Categories() {
  return (
    <div className="bg-[#F6F0E3] px-[120px] py-[48px]">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#1F2937]">
            All categories
          </h1>
          <p className="mt-[6px] text-[14px] text-gray-500">
            Showing 1-24 of 1234 products
          </p>
        </div>

        <div className="flex items-center gap-[10px] text-[14px]">
          <span className="text-gray-600">Sort by:</span>
          <button className="flex items-center gap-[10px] rounded-[8px] border border-gray-200 bg-white px-[16px] py-[10px] font-semibold text-[#1F2937]">
            Recommended
            <ChevronDown className="h-[16px] w-[16px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div className="mt-[24px] grid grid-cols-5 gap-[20px]">
        {PRODUCTS.map((product, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[14px] bg-white"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                aria-label="Add to favorites"
                className="absolute right-[12px] top-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white"
              >
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
              <h3 className="text-[16px] font-bold text-[#1F2937]">
                {product.name}
              </h3>
              <p className="mt-[2px] text-[13px] text-gray-500">1g</p>

              <div className="mt-[6px] flex items-center gap-[6px]">
                <div className="flex text-[#E3A008]">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-[13px] w-[13px]"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-[13px] text-gray-500">4.9 (312)</span>
              </div>

              <div className="mt-[8px] flex items-baseline gap-[6px]">
                <span className="text-[20px] font-extrabold text-[#1F2937]">
                  ${product.price}
                </span>
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

      {/* Pagination */}
      <div className="mt-[40px] flex items-center justify-center gap-[8px]">
        <button className="flex items-center gap-[6px] rounded-[8px] px-[14px] py-[10px] text-[14px] font-medium text-gray-400">
          <ChevronLeft className="h-[16px] w-[16px]" strokeWidth={2} />
          Previous
        </button>

        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] bg-[#3E5730] text-[14px] font-semibold text-white">
          1
        </button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">
          2
        </button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">
          3
        </button>
        <span className="flex h-[38px] w-[38px] items-center justify-center text-[14px] text-gray-400">
          ...
        </span>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">
          67
        </button>
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1F2937]">
          68
        </button>

        <button className="flex items-center gap-[6px] rounded-[8px] px-[14px] py-[10px] text-[14px] font-medium text-[#1F2937]">
          Next
          <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}