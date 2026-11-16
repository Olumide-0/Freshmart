"use client";

import ProductThumb from "@/components/admin/ProductThumb";
import { Card, Change, SampleTag } from "@/components/admin/overview/parts";

// items: from getTopSelling() (sample orders). productsById: real products from
// the API, used for the photo and current name when the id exists.
// periodLabel: "this week" or "in the week to Nov 12" (a picked past day).
export default function TopSelling({ items, productsById, periodLabel = "this week" }) {
  return (
    <Card className="flex min-w-0 flex-col p-[16px] sm:p-[20px]">
      <div className="flex items-center gap-[8px]">
        <h2 className="text-[15px] font-extrabold text-[#1F2937]">Top Selling Products</h2>
        <SampleTag />
      </div>

      {items.length === 0 ? (
        <p className="mt-[16px] text-[13px] text-gray-500">No sales {periodLabel}.</p>
      ) : (
        <ul className="mt-[12px] flex flex-col gap-[12px]">
          {items.map((item) => {
            const product = productsById?.get(item.productId);
            return (
              <li key={item.productId} className="flex items-center gap-[10px]">
                <ProductThumb src={product?.image} alt="" className="h-[36px] w-[36px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[#1F2937]">{product?.name ?? item.name}</p>
                  <p className="truncate text-[11px] text-gray-500">{item.units} units sold {periodLabel}</p>
                </div>
                <div className="shrink-0 text-right text-[11px]">
                  <p className="font-bold text-[#1F2937]">{item.totalUnits} sold</p>
                  <Change value={item.change} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
