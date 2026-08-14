import Image from "next/image"
import avocado from "../../assets/image/image 95.png"
import tomato from "../../assets/image/image 98.png"
import freshness from "../../assets/image/Group 49.png"
import { Leaf, Mic, RotateCw, Truck, Soup, Star } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Freshness Guaranteed",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: Mic,
    title: "AI voice shopping",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: RotateCw,
    title: "Buy again",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: Truck,
    title: "Flexible delivery",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: Soup,
    title: "Mexican favorites",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: Star,
    title: "Personalized picks",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
]

export default function Fifth() {
  return (
    <div className=" w-full">
        <section className="relative overflow-hidden bg-[#F5EEE2] px-6 py-20 md:py-28">
      {/* Avocado — bottom left */}
      <div className="pointer-events-none absolute -left-6 top-20 hidden w-40 md:block lg:w-52">
        <Image
          src={avocado}
          alt=""
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      {/* Tomato crate — top right */}
      <div className="pointer-events-none absolute -right-4 top-24 hidden w-44 md:block lg:w-56">
        <Image
          src={tomato}
          alt=""
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-[64px] font-bold leading-tight tracking-tight ">
          <span className="text-[#3E5730]">Groceries, made fresh.</span>
          <br />
          <span className="text-[#1F2937]">Made simple</span>
        </h2>
      </div>

      {/* Feature cards */}
      <div className="relative px-[122px]  mx-auto mt-14 grid  grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-5">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center rounded-[20px] border border-[#E4A94CD9] bg-white px-[19px] py-[28] text-center shadow-sm"
          >
            <span className="mb-[18px] flex h-12 w-12 items-center justify-center rounded-full bg-[#3E5730]">
              <Icon className="h-8 w-8 text-white" strokeWidth={2} />
            </span>
            <h3 className="text-[16px] font-extrabold text-[#1F2937] mb-[10px]">{title}</h3>
            <p className="text-[16px] leading-relaxed text-[#1F2937]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
    <div>
        <Image src={freshness} alt=""/>
    </div>
    </div>
  )
}