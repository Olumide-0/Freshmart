"use client";

import { Card, Pill, SampleTag, formatAmount, formatOrderDate } from "@/components/admin/overview/parts";

const STATUS = {
  delivered: { label: "Delivered", tone: "green" },
  processing: { label: "Processing", tone: "blue" },
  pending: { label: "Pending", tone: "yellow" },
};

const itemNames = (order) => order.items.map((it) => it.name).join(", ");
const total = (order) => `$${formatAmount(order.total)} MXN`;

// orders: from getRecentOrders() (sample data).
export default function RecentOrders({ orders, now }) {
  return (
    <Card className="min-w-0">
      <div className="flex items-center gap-[8px] px-[16px] pb-[8px] pt-[16px] sm:px-[20px] sm:pt-[20px]">
        <h2 className="text-[15px] font-extrabold text-[#1F2937]">Recent Orders</h2>
        <SampleTag />
      </div>

      {/* Tablet and up: table */}
      <div className="hidden md:block">
        <table className="w-full table-fixed text-left text-[12px]">
          <thead className="text-[11px] text-gray-500">
            <tr className="border-b border-black/5">
              <th scope="col" className="w-[13%] py-[10px] pl-[20px] font-semibold">Order ID</th>
              <th scope="col" className="w-[18%] py-[10px] pr-[12px] font-semibold">Customer</th>
              <th scope="col" className="py-[10px] pr-[12px] font-semibold">Items</th>
              <th scope="col" className="w-[13%] py-[10px] pr-[12px] font-semibold">Total</th>
              <th scope="col" className="w-[13%] py-[10px] pr-[12px] font-semibold">Status</th>
              <th scope="col" className="w-[13%] py-[10px] pr-[20px] font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {orders.map((o) => (
              <tr key={o.id} className="align-middle">
                <td className="py-[14px] pl-[20px] font-bold text-[#1F2937]">#{o.id}</td>
                <td className="truncate py-[14px] pr-[12px] text-[#1F2937]">{o.customer}</td>
                <td className="truncate py-[14px] pr-[12px] text-gray-600" title={itemNames(o)}>{itemNames(o)}</td>
                <td className="whitespace-nowrap py-[14px] pr-[12px] font-bold text-[#1F2937]">{total(o)}</td>
                <td className="py-[14px] pr-[12px]"><Pill tone={STATUS[o.status].tone}>{STATUS[o.status].label}</Pill></td>
                <td className="py-[14px] pr-[20px] leading-snug text-gray-500">{formatOrderDate(o.createdAt, now)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: stacked rows */}
      <ul className="divide-y divide-black/5 md:hidden">
        {orders.map((o) => (
          <li key={o.id} className="px-[16px] py-[12px]">
            <div className="flex items-center justify-between gap-[8px]">
              <span className="text-[13px] font-bold text-[#1F2937]">#{o.id}</span>
              <Pill tone={STATUS[o.status].tone}>{STATUS[o.status].label}</Pill>
            </div>
            <p className="mt-[4px] truncate text-[12px] text-[#1F2937]">{o.customer}</p>
            <p className="truncate text-[12px] text-gray-500">{itemNames(o)}</p>
            <div className="mt-[4px] flex items-center justify-between gap-[8px] text-[12px]">
              <span className="font-bold text-[#1F2937]">{total(o)}</span>
              <span className="text-gray-500">{formatOrderDate(o.createdAt, now)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
