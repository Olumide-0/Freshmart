import Image from "next/image"
import carrot from "../../assets/image/image 113.png"
import cabbage from "../../assets/image/image 187.png"
import tomatoes from "../../assets/image/image 191.png"
import sinamon from "../../assets/image/ImageContainer.png"
import { Star, ArrowRight, Wallet } from "lucide-react"

const deals = [
  {
    image: carrot,
    badge: "Off season",
    name: "Carrot",
    weight: "1g",
    rating: "4.9",
    reviews: "312",
    price: "42",
    oldPrice: "100",
    discount: "25% OFF",
  },
  {
    image: cabbage,
    badge: null,
    name: "Cabbage",
    weight: "1g",
    rating: "4.9",
    reviews: "312",
    price: "42",
    oldPrice: "100",
    discount: "15% OFF",
  },
  {
    image: tomatoes,
    badge: "Low in stock",
    name: "Tomatoes",
    weight: "1g",
    rating: "4.9",
    reviews: "312",
    price: "42",
    oldPrice: "100",
    discount: "10% OFF",
  },
  {
    image: sinamon,
    badge: null,
    name: "Tomatoes",
    weight: "1g",
    rating: "4.9",
    reviews: "312",
    price: "42",
    oldPrice: "100",
    discount: "25% OFF",
  },
]

export default function Hero() {
  return (
    <section className="bg-[#F5EEE2]  px-6 py-[20px] md:px-[122px] md:py-10">
      {/* Card container */}
      <div className="rounded-[28px] bg-[#F9F4E9] p-8 md:p-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          {/* Left: heading */}
          <div className="relative shrink-0 lg:w-[360px]">
            <p className="mb-3 text-xs font-bold tracking-wider text-[#C6672E]">
              TODAY&apos;S TOP DEALS
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
              <span className="text-[#3E6B4A]">Fresh deals,</span>
              <br />
              <span className="text-[#1B2430]">you&apos;ll love</span>
            </h1>
            <p className="mt-5 text-gray-600">
              Save more on your daily essentials today!
            </p>
            <button className="mt-7 rounded-full bg-[#3E6B4A] px-8 py-4 font-semibold text-white transition hover:bg-[#33593D]">
              Shop all deals
            </button>
          </div>

          {/* Right: deal cards + promo */}
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {deals.map((deal, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl bg-white"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover"
                  />
                  {deal.badge && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#C6672E]">
                      {deal.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-3 py-3">
                  <h3 className="text-sm font-bold text-[#1B2430]">
                    {deal.name}
                  </h3>
                  <p className="text-xs text-gray-500">{deal.weight}</p>

                  <div className="mt-1 flex items-center gap-1">
                    <div className="flex text-[#E3A008]">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-3 w-3"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {deal.rating} ({deal.reviews})
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-[#1B2430]">
                      ${deal.price}
                      <sup className="ml-0.5 text-[10px] font-semibold">
                        MXN
                      </sup>
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {deal.oldPrice}MXN
                    </span>
                  </div>

                  <button className="mt-3 w-full rounded-full bg-[#D97A2B] py-2 text-xs font-bold text-white transition hover:bg-[#C6672E]">
                    {deal.discount}
                  </button>
                </div>
              </div>
            ))}

            {/* Promo panel */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#CFE0CE] p-5 sm:col-span-3 lg:col-span-1">
              <div>
                <Wallet
                  className="h-9 w-9 text-[#3E6B4A]"
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-sm font-bold text-[#1B2430]">
                  More savings inside!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Check out all our exclusive offers
                </p>
              </div>
              
               <a href="#"
                className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#1B2430] underline underline-offset-2"
              >
                View all offer
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}