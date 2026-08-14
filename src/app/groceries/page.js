import Categories from "@/components/groceries/categories"
import Hero from "@/components/groceries/hero"
import Second from "@/components/groceries/second"
import { ChevronRight } from "lucide-react"
import Link from "next/link"


export default function GroceriesPage() {
  return (
    <main className="bg-[#F5EEE2] pt-[260px] ">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-6 text-sm md:px-[122px]">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="font-medium text-[#C6672E]">Shop groceries</span>
      </div>
      <Hero />
      <Second/>
      <Categories/>
    </main>
  )
}