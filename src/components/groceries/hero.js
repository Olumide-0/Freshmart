import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Wallet } from "lucide-react"
import { discountPercent, formatWeight, productImage } from "@/lib/products"

// deals: the API's "deals" collection (products with an oldPrice), fetched by app/groceries/page.js.
export default function Hero({ deals = [] }) {
  return (
    <section className="bg-[#F5EEE2]  px-6 py-[20px] sm:px-[40px] sm:py-[24px] md:px-[64px] md:py-10 ">
      {/* Card container */}
      <div className="rounded-[28px] bg-[#F9F5EC] p-[20px] ">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-center">
          {/* Left: heading */}
          <div className="relative shrink-0 xl:w-[360px]">
            <p className="mb-3 text-[13px] font-extrabold tracking-wider text-[#C6672E]">
              TODAY&apos;S TOP DEALS
            </p>
            <h1 className="text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[40px] md:text-[48px] lg:text-[60px]">
              <span className="text-[#3E5730]">Fresh deals,</span>
              <br />
              <span className="text-[#1F2937]">you&apos;ll love</span>
            </h1>
            <p className="mt-5 text-[#1F2937] text-[14px] sm:text-[15px]">
              Save more on your daily essentials today!
            </p>
            <button className="w-full sm:w-auto sm:px-[48px] xl:w-full xl:px-0 mt-7 rounded-[11px] bg-[#3E5730]  py-[8px] font-semibold text-white transition hover:bg-[#33593D]">
              Shop all deals
            </button>
          </div>

          {/* Right: deal cards + promo */}
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white border border-[#E4A94CD9]/80"
              >
                <Link href={`/product/${deal.id}`} className="relative block aspect-square w-full">
                  <Image
                    src={productImage(deal.image)}
                    alt={deal.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
                    className="object-cover"
                  />
                  {deal.badge && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#C6672E]">
                      {deal.badge}
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col px-[13px] pt-3 pb-[27px]">
                  <Link href={`/product/${deal.id}`}>
                    <h3 className="text-[12px] font-extrabold text-[#1F2937]">
                      {deal.name}
                    </h3>
                  </Link>
                  <p className="text-[16px] text-[#4C545F]">{formatWeight(deal)}</p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[17px] font-extrabold text-[#1F2937]">
                      ${deal.price}
                      <sup className="ml-0.5 text-[9px] text-[#4C545F]">
                        MXN
                      </sup>
                    </span>
                    {discountPercent(deal) != null && (
                      <span className="text-[9px] text-[#989DA3] line-through">
                        {deal.oldPrice}MXN
                      </span>
                    )}
                  </div>

                  <button className="mt-3 w-full rounded-[12px] bg-[#D97706] py-[5px] text-[12px] font-bold text-white transition hover:bg-[#C6672E]">
                    {discountPercent(deal) != null ? `${discountPercent(deal)}% OFF` : "Deal"}
                  </button>
                </div>
              </div>
            ))}

            {/* Promo panel */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#BED7BF] px-[14px] py-[29px] sm:col-span-3 lg:col-span-1">
              <div>
                <Wallet
                  className="h-9 w-9 text-[#3E6B4A]"
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-[12px] font-extrabold text-[#1F2937]">
                  More savings inside!
                </h3>
                <p className="mt-2 text-[12px] text-[#1F2937]">
                  Check out all our exclusive offers
                </p>
              </div>
              
               <a href="#"
                className="mt-6 flex items-center gap-2 text-[12px] font-bold text-[#1F2937] underline underline-offset-2"
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