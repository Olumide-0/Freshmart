// import Link from "next/link";
// import { ChevronRight } from "lucide-react";
// import { CATEGORY_LABELS } from "@/lib/categories";
// import { PRODUCTS } from "@/data/product";
// import ProductGrid from "@/components/products/productGrid";


// export default async function ProductCategoryPage({ params }) {
//   const { product: slug } = await params;
//   const categoryLabel = CATEGORY_LABELS[slug] ?? "Products";
//   const items = PRODUCTS.filter((p) => p.category === slug);

//   return (
//     <div className="w-full bg-[#F6F0E3] px-[120px] py-[24px]">
//       <div className="flex items-center gap-2 text-[13px] text-gray-500">
//         <Link href="/" className="hover:text-gray-700">
//           Home
//         </Link>
//         <ChevronRight className="h-[14px] w-[14px]" />
//         <Link href="/groceries" className="hover:text-gray-700">
//           Shop by department
//         </Link>
//         <ChevronRight className="h-[14px] w-[14px]" />
//         <span className="font-semibold text-[#C6672E]">{categoryLabel}</span>
//       </div>

//       <h1 className="mt-[16px] text-[26px] font-extrabold text-[#1F2937]">
//         {categoryLabel}
//       </h1>

//       <ProductGrid products={items} />
//     </div>
//   );
// }


import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/categories";
import { PRODUCTS } from "@/data/product";
import ProductGrid from "@/components/products/productGrid";


export default async function ProductCategoryPage({ params }) {
  const { product: slug } = await params;
  const categoryLabel = CATEGORY_LABELS[slug] ?? "Products";
  const items = PRODUCTS.filter((p) => p.category === slug);

  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[20px] sm:px-[40px] md:px-[64px]  xl:py-[24px]">
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 sm:text-[13px]">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <Link href="/groceries" className="hover:text-gray-700">
          Shop by department
        </Link>
        <ChevronRight className="h-[14px] w-[14px]" />
        <span className="font-semibold text-[#C6672E]">{categoryLabel}</span>
      </div>

      <h1 className="mt-[16px] text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
        {categoryLabel}
      </h1>

      <ProductGrid products={items} />
    </div>
  );
}