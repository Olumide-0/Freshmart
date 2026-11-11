import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OCCASION_LABELS } from "@/lib/occasions";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/products/productGrid";

export default async function OccasionCategoryPage({ params }) {
  const { occasion: slug } = await params;
  const occasionLabel = OCCASION_LABELS[slug] ?? "Products";
  const items = await getProducts({ occasion: slug });

  const emptyMessage = (
    <>
      <p className="text-[15px] font-semibold text-[#1F2937]">
        We&rsquo;re still stocking up for {occasionLabel.toLowerCase()}.
      </p>
      <p className="mt-[6px] text-[14px]">
        Check back soon, or{" "}
        <Link href="/groceries" className="font-semibold text-[#3E5730] underline underline-offset-2">
          browse all groceries
        </Link>
        .
      </p>
    </>
  );

  return (
    <div className="w-full bg-[#F6F0E3] px-4 py-5 sm:px-8 md:px-12 xl:py-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 sm:gap-2 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <Link href="/groceries" className="hover:text-gray-700">
          Shop by occasion
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0" />

        <span className="max-w-[180px] truncate font-semibold text-[#C6672E] sm:max-w-none">
          {occasionLabel}
        </span>
      </div>

      {/* Page Heading */}
      <h1 className="mt-4 text-[22px] font-extrabold text-[#1F2937] sm:mt-5 sm:text-[26px]">
        {occasionLabel}
      </h1>

      {/* Products */}
      <ProductGrid products={items} emptyMessage={emptyMessage} />
    </div>
  );
}

