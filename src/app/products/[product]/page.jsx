import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/products/productGrid";

export default async function ProductCategoryPage({ params }) {
  const { product: slug } = await params;
  const categoryLabel = CATEGORY_LABELS[slug] ?? "Products";
  const items = await getProducts({ category: slug });

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-5 sm:px-8 md:px-12  xl:py-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 sm:gap-2 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>

        <ChevronRight className="h-[14px] w-[14px] shrink-0" />

        <Link href="/groceries" className="hover:text-gray-700">
          Shop by department
        </Link>

        <ChevronRight className="h-[14px] w-[14px] shrink-0" />

        <span className="font-semibold text-[#C6672E]">
          {categoryLabel}
        </span>
      </div>

      {/* Heading */}
      <h1 className="mt-4 text-[22px] font-extrabold text-[#1F2937] sm:mt-5 sm:text-[24px] lg:text-[26px]">
        {categoryLabel}
      </h1>

      {/* Product Grid */}
      <ProductGrid products={items} />
    </div>
  );
}
