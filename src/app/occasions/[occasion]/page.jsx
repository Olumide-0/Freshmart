import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OCCASION_LABELS } from "@/lib/occasions";
import { OCCASION_PRODUCTS } from "@/data/occasionProducts";
import ProductGrid from "@/components/products/productGrid";

export default async function OccasionCategoryPage({ params }) {
  const { occasion: slug } = await params;
  const occasionLabel = OCCASION_LABELS[slug] ?? "Products";
  const items = OCCASION_PRODUCTS.filter((p) => p.occasion === slug);

  return (
    <div className="w-full bg-[#F6F0E3] px-[120px] py-[24px]">
      <div className="flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <Link href="/groceries" className="hover:text-gray-700">
          Shop by occasion
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">{occasionLabel}</span>
      </div>

      <h1 className="mt-[16px] text-[26px] font-extrabold text-[#1F2937]">
        {occasionLabel}
      </h1>

      <ProductGrid products={items} />
    </div>
  );
}