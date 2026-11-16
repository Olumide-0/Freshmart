"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { LOW_STOCK_THRESHOLD, getCategoryLabel } from "@/lib/admin/productsData";
import ProductThumb from "@/components/admin/ProductThumb";
import { Card } from "@/components/admin/overview/parts";

const SHOWN = 4;

// REAL data: products with stock <= LOW_STOCK_THRESHOLD, lowest first.
// alerts: that list (undefined while loading); total: number of products;
// error: load error message (shown with a Retry button).
export default function LowStock({ alerts, total, error, onRetry }) {
  return (
    <Card className="flex min-w-0 flex-col p-[16px] sm:p-[20px]">
      <div className="flex items-start justify-between gap-[8px]">
        <div className="min-w-0">
          <h2 className="text-[15px] font-extrabold text-[#1F2937]">Low Stock Left</h2>
          {alerts && (
            <p className="mt-[2px] text-[11px] text-gray-500">
              {alerts.length} of {total} products at {LOW_STOCK_THRESHOLD} or fewer
            </p>
          )}
        </div>
        <Link
          href="/admin/products"
          className="flex shrink-0 items-center gap-[4px] text-[12px] font-semibold text-[#1F2937] hover:text-[#2F5D3A] hover:underline"
        >
          View All
          <ArrowRight className="h-[14px] w-[14px]" strokeWidth={2} />
        </Link>
      </div>

      {error ? (
        <div role="alert" className="mt-[16px] flex flex-col items-start gap-[8px] text-[13px]">
          <p className="font-semibold text-[#1F2937]">Couldn’t load products</p>
          <p className="break-words text-gray-500">{error}</p>
          <button
            type="button"
            onClick={() => onRetry()}
            className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#2F5D3A] px-[12px] py-[6px] text-[12px] font-semibold text-white hover:bg-[#3E5730]"
          >
            <RefreshCw className="h-[14px] w-[14px]" strokeWidth={2} />
            Retry
          </button>
        </div>
      ) : alerts === undefined ? (
        <ul className="mt-[12px] flex flex-col gap-[12px]" aria-hidden="true">
          {Array.from({ length: SHOWN }).map((_, i) => (
            <li key={i} className="h-[36px] animate-pulse rounded-[8px] bg-gray-100" />
          ))}
        </ul>
      ) : alerts.length === 0 ? (
        <p className="mt-[16px] text-[13px] text-gray-500">Everything is well stocked.</p>
      ) : (
        <ul className="mt-[12px] flex flex-col gap-[12px]">
          {alerts.slice(0, SHOWN).map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/products/${encodeURIComponent(p.id)}/edit`}
                className="-mx-[6px] flex items-center gap-[10px] rounded-[8px] px-[6px] py-[2px] hover:bg-gray-50"
              >
                <ProductThumb src={p.image} alt="" className="h-[36px] w-[36px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[#1F2937]">{p.name}</p>
                  <p className="truncate text-[11px] text-gray-500">{getCategoryLabel(p.category)}</p>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-red-600">
                  {p.stock <= 0 ? "Out of stock" : `${p.stock} stock left`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
