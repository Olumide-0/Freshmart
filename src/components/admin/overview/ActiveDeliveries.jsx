"use client";

import { Card, Pill, SampleTag, formatTime } from "@/components/admin/overview/parts";

const STAGE = {
  "in-transit": { label: "In Transit", tone: "blue" },
  "out-for-delivery": { label: "Out for Delivery", tone: "green" },
  "arriving-soon": { label: "Arriving Soon", tone: "orange" },
};

// orders: from getActiveDeliveries() (sample data).
export default function ActiveDeliveries({ orders, emptyText = "No deliveries on the road right now." }) {
  return (
    <Card className="min-w-0">
      <div className="flex items-center gap-[8px] px-[16px] pb-[8px] pt-[16px] sm:px-[20px] sm:pt-[20px]">
        <h2 className="text-[15px] font-extrabold text-[#1F2937]">Active Deliveries</h2>
        <SampleTag />
      </div>

      {orders.length === 0 ? (
        <p className="px-[16px] pb-[20px] pt-[8px] text-[13px] text-gray-500 sm:px-[20px]">{emptyText}</p>
      ) : (
        <>
          {/* Tablet and up: table */}
          <div className="hidden md:block">
            <table className="w-full table-fixed text-left text-[12px]">
              <thead className="text-[11px] text-gray-500">
                <tr className="border-b border-black/5">
                  <th scope="col" className="w-[13%] py-[10px] pl-[20px] font-semibold">Order ID</th>
                  <th scope="col" className="w-[20%] py-[10px] pr-[12px] font-semibold">Customer</th>
                  <th scope="col" className="py-[10px] pr-[12px] font-semibold">Delivery Address</th>
                  <th scope="col" className="w-[12%] py-[10px] pr-[12px] font-semibold">ETA</th>
                  <th scope="col" className="w-[18%] py-[10px] pr-[20px] font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-[14px] pl-[20px] font-bold text-[#1F2937]">#{o.id}</td>
                    <td className="truncate py-[14px] pr-[12px] text-[#1F2937]">{o.customer}</td>
                    <td className="truncate py-[14px] pr-[12px] text-gray-600" title={o.address}>{o.address}</td>
                    <td className="whitespace-nowrap py-[14px] pr-[12px] text-gray-600">{formatTime(o.delivery.eta)}</td>
                    <td className="py-[14px] pr-[20px]">
                      <Pill tone={STAGE[o.delivery.stage].tone}>{STAGE[o.delivery.stage].label}</Pill>
                    </td>
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
                  <Pill tone={STAGE[o.delivery.stage].tone}>{STAGE[o.delivery.stage].label}</Pill>
                </div>
                <p className="mt-[4px] truncate text-[12px] text-[#1F2937]">{o.customer}</p>
                <p className="truncate text-[12px] text-gray-500">{o.address}</p>
                <p className="mt-[2px] text-[12px] text-gray-500">ETA {formatTime(o.delivery.eta)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
