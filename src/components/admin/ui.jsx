"use client";

import { getStockStatus, STOCK_STATUSES } from "@/lib/admin/productsData";

const STATUS_STYLES = {
  in: "bg-[#E6F0E1] text-[#3E5730]",
  low: "bg-[#FBE9D9] text-[#C6672E]",
  out: "bg-red-50 text-red-600",
};

export function StatusBadge({ product }) {
  const status = getStockStatus(product);
  const label = STOCK_STATUSES.find((s) => s.value === status)?.label;
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-[10px] py-[3px] text-[12px] font-semibold ${STATUS_STYLES[status]}`}>
      {label}
    </span>
  );
}

// "$42" / "$12.50", shown with a small MXN like the storefront cards.
export function Price({ value }) {
  const text = value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return (
    <span className="whitespace-nowrap font-bold text-[#1F2937]">
      ${text}
      <sup className="ml-[2px] text-[9px] font-semibold">MXN</sup>
    </span>
  );
}

export function AvailabilitySwitch({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-[#2F5D3A]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
