import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import CollectionGrid from "@/components/products/CollectionGrid";

export default async function FreshGroceriesPage() {
  const products = await getProducts({ collection: "fresh-groceries" });

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-6 sm:px-8 sm:py-8 md:px-12 lg:px-16 xl:px-[120px] xl:py-[24px]">
      <div className="flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <span className="font-semibold text-[#C6672E]">
          Fresh groceries
        </span>
      </div>

      <h1 className="mt-3 text-xl font-extrabold text-[#1F2937] sm:mt-[16px] sm:text-2xl md:text-[26px]">
        Fresh groceries
      </h1>

      <CollectionGrid products={products} />
    </div>
  );
}
