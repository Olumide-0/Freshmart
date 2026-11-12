import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/products/productGrid";

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q ?? "").trim();
  // An empty search makes no request.
  const results = query ? await getProducts({ q: query }) : [];

  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[24px] sm:px-[40px] md:px-[64px] xl:px-[120px]">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">Search</span>
      </div>

      <h1 className="mt-[16px] break-words text-[22px] font-extrabold text-[#1F2937] sm:text-[26px]">
        {results.length > 0
          ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
          : `No results for "${query}"`}
      </h1>

      {results.length === 0 && (
        <p className="mt-[10px] text-[15px] text-gray-500">
          Try a different search term, or check your spelling.
        </p>
      )}

      <ProductGrid products={results} emptyMessage={null} />
    </div>
  );
}
