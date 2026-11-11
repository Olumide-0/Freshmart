import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import CollectionGrid from "@/components/products/CollectionGrid";

export default async function PopularThisWeekPage() {
  const products = await getProducts({ collection: "popular-this-week" });

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-6 sm:px-8 sm:py-8 md:px-12 lg:px-16  xl:py-[24px]">
      <div className="flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">Popular this week</span>
      </div>

      <h1 className="mt-3 text-xl font-extrabold text-[#1F2937] sm:mt-[16px] sm:text-2xl md:text-[26px]">
        Popular this week
      </h1>

      <CollectionGrid products={products} />
    </div>
  );
}
