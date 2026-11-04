"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  CATEGORIES,
  STOCK_STATUSES,
  getCategoryLabel,
  getStockStatus,
  removeProduct,
  updateProduct,
  useProducts,
} from "@/lib/admin/productsData";
import ProductThumb from "@/components/admin/ProductThumb";
import DeleteModal from "@/components/admin/DeleteModal";
import { AvailabilitySwitch, Price, StatusBadge } from "@/components/admin/ui";
import { toast } from "@/components/admin/Toast";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "stock-asc", label: "Stock: low to high" },
  { value: "stock-desc", label: "Stock: high to low" },
];

const COMPARATORS = {
  newest: (a, b) => b.createdAt - a.createdAt,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "stock-asc": (a, b) => a.stock - b.stock,
  "stock-desc": (a, b) => b.stock - a.stock,
};

const fieldClass =
  "w-full rounded-[8px] border border-gray-200 bg-white px-[12px] py-[10px] text-[14px] text-[#1F2937] outline-none focus:border-[#2F5D3A]";

// Same pattern as the storefront pagination: first, last, and neighbours of the current page.
function getPageNumbers(page, totalPages) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }
  return pages;
}

function editHref(id) {
  return `/admin/products/${encodeURIComponent(id)}/edit`;
}

export default function ProductsTable() {
  const products = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pendingIds, setPendingIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loading = products === undefined;
  const term = query.trim().toLowerCase();
  const filtersActive = term !== "" || category !== "all" || status !== "all";

  const filtered = (products ?? []).filter(
    (p) =>
      (!term || p.name.toLowerCase().includes(term)) &&
      (category === "all" || p.category === category) &&
      (status === "all" || getStockStatus(p) === status)
  );
  const sorted = [...filtered].sort(
    (a, b) => COMPARATORS[sort](a, b) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id)
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // Clamp so deleting the last item on the last page never leaves an empty page.
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  // Any filter/search/sort change goes back to page 1.
  const onFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setPage(1);
  };

  const goToPage = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

  const toggleAvailable = async (product) => {
    setPendingIds((ids) => [...ids, product.id]);
    try {
      await updateProduct(product.id, { available: !product.available });
      toast.success(`${product.name} marked ${product.available ? "unavailable" : "available"}`);
    } catch (err) {
      toast.error(err?.message || "Could not update availability");
    } finally {
      setPendingIds((ids) => ids.filter((id) => id !== product.id));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeProduct(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || "Could not delete product");
    } finally {
      setDeleting(false);
    }
  };

  const summary = loading
    ? "Loading products…"
    : sorted.length === 0
    ? `0 of ${products.length} products`
    : `Showing ${start + 1}-${start + visible.length} of ${sorted.length} products`;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-[12px] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1F2937] sm:text-[26px]">Products</h1>
          <p className="mt-[4px] text-[14px] text-gray-500" aria-live="polite">
            {summary}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-[6px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#3E5730]"
        >
          <Plus className="h-[16px] w-[16px]" strokeWidth={2.5} />
          Add product
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-[20px] grid gap-[12px] rounded-[8px] border border-black/5 bg-white p-[16px] sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_160px_180px]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="admin-search" className="sr-only">Search by name</label>
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-gray-400" strokeWidth={2} />
          <input
            id="admin-search"
            type="search"
            value={query}
            onChange={onFilter(setQuery)}
            placeholder="Search by name"
            className={`${fieldClass} pl-[36px]`}
          />
        </div>
        <div>
          <label htmlFor="admin-category" className="sr-only">Category</label>
          <select id="admin-category" value={category} onChange={onFilter(setCategory)} className={fieldClass}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="admin-status" className="sr-only">Stock status</label>
          <select id="admin-status" value={status} onChange={onFilter(setStatus)} className={fieldClass}>
            <option value="all">All stock statuses</option>
            {STOCK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="admin-sort" className="sr-only">Sort by</label>
          <select id="admin-sort" value={sort} onChange={onFilter(setSort)} className={fieldClass}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="mt-[16px]">
        {loading ? (
          <ul className="flex flex-col gap-[8px]" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex animate-pulse items-center gap-[12px] rounded-[8px] border border-black/5 bg-white p-[14px]">
                <div className="h-[48px] w-[48px] rounded-[8px] bg-gray-100" />
                <div className="flex-1 space-y-[8px]">
                  <div className="h-[12px] w-1/2 rounded bg-gray-100" />
                  <div className="h-[10px] w-1/3 rounded bg-gray-100" />
                </div>
              </li>
            ))}
          </ul>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center rounded-[8px] border border-black/5 bg-white px-[16px] py-[48px] text-center">
            <Package className="h-[32px] w-[32px] text-gray-400" strokeWidth={1.75} />
            <p className="mt-[12px] text-[16px] font-bold text-[#1F2937]">
              {filtersActive ? "No products match your filters" : "No products yet"}
            </p>
            {filtersActive ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-[12px] rounded-[8px] border border-[#D8DADD] px-[16px] py-[8px] text-[14px] font-semibold text-[#1F2937] hover:bg-black/5"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/admin/products/new"
                className="mt-[12px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[8px] text-[14px] font-semibold text-white hover:bg-[#3E5730]"
              >
                Add your first product
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-[8px] border border-black/5 bg-white md:block">
              <table className="w-full text-left text-[14px]">
                <thead className="border-b border-black/5 text-[12px] uppercase tracking-wide text-gray-500">
                  <tr>
                    <th scope="col" className="px-[16px] py-[12px] font-semibold">Product</th>
                    <th scope="col" className="px-[16px] py-[12px] font-semibold">Category</th>
                    <th scope="col" className="px-[16px] py-[12px] font-semibold">Price</th>
                    <th scope="col" className="px-[16px] py-[12px] font-semibold">Stock</th>
                    <th scope="col" className="px-[16px] py-[12px] font-semibold">Status</th>
                    <th scope="col" className="px-[16px] py-[12px] font-semibold">Available</th>
                    <th scope="col" className="px-[16px] py-[12px] text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {visible.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F6F0E3]/50">
                      <td className="px-[16px] py-[12px]">
                        <div className="flex items-center gap-[12px]">
                          <ProductThumb src={p.image} alt={p.name} />
                          <span className="max-w-[240px] truncate font-semibold text-[#1F2937]">{p.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-[16px] py-[12px] text-gray-600">{getCategoryLabel(p.category)}</td>
                      <td className="px-[16px] py-[12px]"><Price value={p.price} /></td>
                      <td className="px-[16px] py-[12px] text-[#1F2937]">{p.stock}</td>
                      <td className="px-[16px] py-[12px]"><StatusBadge product={p} /></td>
                      <td className="px-[16px] py-[12px]">
                        <AvailabilitySwitch
                          checked={p.available}
                          disabled={pendingIds.includes(p.id)}
                          onChange={() => toggleAvailable(p)}
                          label={`${p.name} available`}
                        />
                      </td>
                      <td className="px-[16px] py-[12px]">
                        <div className="flex justify-end gap-[4px]">
                          <Link
                            href={editHref(p.id)}
                            aria-label={`Edit ${p.name}`}
                            className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] text-[#2F5D3A] hover:bg-black/5"
                          >
                            <Pencil className="h-[16px] w-[16px]" strokeWidth={2} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            aria-label={`Delete ${p.name}`}
                            className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-[16px] w-[16px]" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards (works down to 360px) */}
            <ul className="flex flex-col gap-[8px] md:hidden">
              {visible.map((p) => (
                <li key={p.id} className="rounded-[8px] border border-black/5 bg-white p-[14px]">
                  <div className="flex gap-[12px]">
                    <ProductThumb src={p.image} alt={p.name} className="h-[56px] w-[56px]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold text-[#1F2937]">{p.name}</p>
                      <p className="text-[13px] text-gray-500">{getCategoryLabel(p.category)}</p>
                      <div className="mt-[6px] flex flex-wrap items-center gap-x-[10px] gap-y-[4px] text-[13px]">
                        <Price value={p.price} />
                        <span className="text-gray-600">Stock: {p.stock}</span>
                        <StatusBadge product={p} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[12px] flex items-center justify-between border-t border-black/5 pt-[12px]">
                    <div className="flex items-center gap-[8px] text-[13px] text-gray-600">
                      <AvailabilitySwitch
                        checked={p.available}
                        disabled={pendingIds.includes(p.id)}
                        onChange={() => toggleAvailable(p)}
                        label={`${p.name} available`}
                      />
                      {p.available ? "Available" : "Unavailable"}
                    </div>
                    <div className="flex gap-[4px]">
                      <Link
                        href={editHref(p.id)}
                        aria-label={`Edit ${p.name}`}
                        className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] text-[#2F5D3A] hover:bg-black/5"
                      >
                        <Pencil className="h-[16px] w-[16px]" strokeWidth={2} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        aria-label={`Delete ${p.name}`}
                        className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-[16px] w-[16px]" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-[24px] flex items-center justify-center gap-1 sm:gap-[8px]">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-[8px] px-2 py-2 text-[13px] font-medium text-[#1F2937] hover:bg-black/5 disabled:text-gray-400 disabled:hover:bg-transparent sm:px-[14px] sm:text-[14px]"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                {getPageNumbers(currentPage, totalPages).map((n, i) =>
                  n === "..." ? (
                    <span key={`gap-${i}`} className="flex h-8 w-6 items-center justify-center text-[13px] text-gray-400 sm:h-[38px] sm:w-[38px]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      aria-current={n === currentPage ? "page" : undefined}
                      className={`flex h-8 w-8 items-center justify-center rounded-[8px] text-[13px] font-semibold sm:h-[38px] sm:w-[38px] sm:text-[14px] ${
                        n === currentPage ? "bg-[#3E5730] text-white" : "text-[#1F2937] hover:bg-black/5"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-[8px] px-2 py-2 text-[13px] font-medium text-[#1F2937] hover:bg-black/5 disabled:text-gray-400 disabled:hover:bg-transparent sm:px-[14px] sm:text-[14px]"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          productName={deleteTarget.name}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
