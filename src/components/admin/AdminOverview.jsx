"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight, CloudOff, Package, PackageCheck, Pencil, RefreshCw, Tags } from "lucide-react";
import {
  CATEGORIES,
  LOW_STOCK_THRESHOLD,
  getCategoryLabel,
  getStockStatus,
  reloadProducts,
  useProducts,
  useProductsError,
} from "@/lib/admin/productsData";
import ProductThumb from "@/components/admin/ProductThumb";
import { Price, StatusBadge } from "@/components/admin/ui";

const RECENT_COUNT = 5;

function StatCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="rounded-[8px] border border-black/5 bg-white p-[16px] sm:p-[20px]">
      <div className="flex items-start justify-between gap-[8px]">
        <p className="text-[13px] font-semibold text-gray-500 sm:text-[14px]">{label}</p>
        <span className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full sm:h-[36px] sm:w-[36px] ${tone}`}>
          <Icon className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-[6px] text-[26px] font-extrabold text-[#1F2937] sm:text-[28px]">{value}</p>
      <p className="mt-[2px] text-[12px] text-gray-500 sm:text-[13px]">{note}</p>
    </div>
  );
}

export default function AdminOverview() {
  const products = useProducts();
  const loadError = useProductsError();

  const header = (
    <div>
      <h1 className="text-[22px] font-extrabold text-[#1F2937] sm:text-[26px]">Overview</h1>
      <p className="mt-[4px] text-[14px] text-gray-500">Live product data from the API.</p>
    </div>
  );

  if (products === undefined && loadError) {
    return (
      <div>
        {header}
        <div role="alert" className="mt-[20px] flex flex-col items-center rounded-[8px] border border-black/5 bg-white px-[16px] py-[48px] text-center">
          <CloudOff className="h-[32px] w-[32px] text-gray-400" strokeWidth={1.75} />
          <p className="mt-[12px] text-[16px] font-bold text-[#1F2937]">Couldn’t load products</p>
          <p className="mt-[4px] break-words text-[14px] text-gray-500">{loadError}</p>
          <button
            type="button"
            onClick={() => reloadProducts()}
            className="mt-[16px] inline-flex items-center gap-[6px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[8px] text-[14px] font-semibold text-white hover:bg-[#3E5730]"
          >
            <RefreshCw className="h-[16px] w-[16px]" strokeWidth={2} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products === undefined) {
    return (
      <div>
        {header}
        <div className="mt-[20px] grid grid-cols-2 gap-[12px] lg:grid-cols-4" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[118px] animate-pulse rounded-[8px] border border-black/5 bg-white" />
          ))}
        </div>
        <div className="mt-[20px] h-[320px] animate-pulse rounded-[8px] border border-black/5 bg-white" aria-hidden="true" />
        <p className="sr-only" aria-live="polite">Loading overview…</p>
      </div>
    );
  }

  const count = (status) => products.filter((p) => getStockStatus(p) === status).length;
  const outOfStock = count("out");
  const unavailable = products.filter((p) => !p.available).length;
  const categoriesInUse = new Set(products.map((p) => p.category)).size;
  const recent = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, RECENT_COUNT);

  return (
    <div>
      {header}

      <div className="mt-[20px] grid grid-cols-2 gap-[12px] lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total products"
          value={products.length}
          note={`${outOfStock} out of stock · ${unavailable} unavailable`}
          tone="bg-[#E6F0E1] text-[#2F5D3A]"
        />
        <StatCard
          icon={PackageCheck}
          label="In stock"
          value={count("in")}
          note={`More than ${LOW_STOCK_THRESHOLD} left`}
          tone="bg-[#E6F0E1] text-[#2F5D3A]"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low stock"
          value={count("low")}
          note={`${LOW_STOCK_THRESHOLD} or fewer left`}
          tone="bg-[#FBE9D9] text-[#C6672E]"
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={categoriesInUse}
          note={`In use, of ${CATEGORIES.length}`}
          tone="bg-[#E6F0E1] text-[#2F5D3A]"
        />
      </div>

      <section className="mt-[20px] rounded-[8px] border border-black/5 bg-white">
        <div className="flex items-center justify-between border-b border-black/5 px-[16px] py-[14px] sm:px-[20px]">
          <h2 className="text-[16px] font-extrabold text-[#1F2937] sm:text-[18px]">Recent products</h2>
          <Link
            href="/admin/products"
            className="flex items-center gap-[2px] text-[14px] font-semibold text-[#2F5D3A] hover:underline"
          >
            View all
            <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center px-[16px] py-[40px] text-center">
            <p className="text-[15px] font-bold text-[#1F2937]">No products yet</p>
            <Link
              href="/admin/products/new"
              className="mt-[12px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[8px] text-[14px] font-semibold text-white hover:bg-[#3E5730]"
            >
              Add product
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-black/5">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-[12px] px-[16px] py-[12px] sm:px-[20px]">
                <ProductThumb src={p.image} alt={p.name} className="h-[44px] w-[44px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#1F2937]">{p.name}</p>
                  <p className="truncate text-[13px] text-gray-500">{getCategoryLabel(p.category)}</p>
                </div>
                <div className="hidden sm:block">
                  <StatusBadge product={p} />
                </div>
                <div className="text-[14px]">
                  <Price value={p.price} />
                </div>
                <Link
                  href={`/admin/products/${encodeURIComponent(p.id)}/edit`}
                  aria-label={`Edit ${p.name}`}
                  className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] text-[#2F5D3A] hover:bg-black/5"
                >
                  <Pencil className="h-[16px] w-[16px]" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
