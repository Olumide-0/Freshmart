"use client";

import { CircleCheck, ClipboardList, Package, ShoppingCart, Users, Wallet } from "lucide-react";
import { Change, SampleTag, formatAmount } from "@/components/admin/overview/parts";

// stats: from getOrderStats() in src/lib/admin/sampleData.js (all sample for now),
// for one day. compareLabel: "vs yesterday" (today) or "vs day before" (a past day).
export default function StatCards({ stats, compareLabel = "vs yesterday" }) {
  const cards = [
    { key: "revenue", label: "Total Revenue", icon: Wallet, tone: "bg-[#E6F0E1] text-[#2F5D3A]", money: true },
    { key: "orders", label: "Total Orders", icon: ShoppingCart, tone: "bg-[#FBF1D6] text-[#A07A12]" },
    { key: "pending", label: "Pending Orders", icon: ClipboardList, tone: "bg-[#FBE3D3] text-[#C6672E]" },
    { key: "completed", label: "Completed Orders", icon: CircleCheck, tone: "bg-[#E6F0E1] text-[#2F8A3E]" },
    { key: "newCustomers", label: "New Customers", icon: Users, tone: "bg-gray-100 text-gray-600", hint: "Customers ordering for the first time in two weeks" },
    { key: "sold", label: "Product Sold", icon: Package, tone: "bg-[#FDE6D2] text-[#E07B2A]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 xl:grid-cols-6">
      {cards.map(({ key, label, icon: Icon, tone, money, hint }) => {
        const { value, change } = stats[key];
        return (
          <div key={key} className="flex min-w-0 flex-col rounded-[12px] border border-black/5 bg-white p-[12px] sm:p-[14px]">
            <div className="flex items-start justify-between gap-[6px]">
              <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-[15px] w-[15px]" strokeWidth={2} aria-hidden="true" />
              </span>
              <SampleTag />
            </div>
            <p className="mt-[8px] truncate text-[12px] font-semibold leading-tight text-gray-500" title={hint}>
              {label}
            </p>
            <p className="mt-[4px] flex items-baseline gap-[3px] text-[18px] font-extrabold text-[#1F2937] sm:text-[20px]">
              <span className="truncate">{money ? `$${formatAmount(value)}` : value.toLocaleString("en-US")}</span>
              {money && <span className="text-[9px] font-semibold text-gray-500">MXN</span>}
            </p>
            <p className="mt-auto pt-[6px] text-[11px]">
              <Change value={change} suffix={compareLabel} />
            </p>
          </div>
        );
      })}
    </div>
  );
}
