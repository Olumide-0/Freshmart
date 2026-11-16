"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LOW_STOCK_THRESHOLD, reloadProducts, useProducts, useProductsError } from "@/lib/admin/productsData";
import {
  endOfDay,
  getActiveDeliveries,
  getDailySales,
  getOrderStats,
  getRecentOrders,
  getSampleOrders,
  getTopSelling,
} from "@/lib/admin/sampleData";
import { parseDayKey, selectedPastDay, useClock } from "@/lib/admin/useClock";
import { useAuthStore } from "@/store/useAuthStore";
import { displayName } from "@/components/admin/overview/TopBar";
import StatCards from "@/components/admin/overview/StatCards";
import SalesChart from "@/components/admin/overview/SalesChart";
import TopSelling from "@/components/admin/overview/TopSelling";
import LowStock from "@/components/admin/overview/LowStock";
import RecentOrders from "@/components/admin/overview/RecentOrders";
import ActiveDeliveries from "@/components/admin/overview/ActiveDeliveries";

// Admin Overview.
// The header strip (search, date picker, bell, account) is in AdminShell.
// REAL (from the API): Low Stock Left, product count,
//   product photos/names in Top Selling.
// SAMPLE (src/lib/admin/sampleData.js, labelled "Sample" on screen): stat cards,
//   sales chart, top selling numbers, recent orders, active deliveries.
// ?day=yyyy-mm-dd (from the header calendar) shows a past day as of its end;
// without it, today as of now, refreshed every minute.
export default function AdminOverview() {
  const user = useAuthStore((s) => s.user);
  const products = useProducts();
  const loadError = useProductsError();
  const nowMs = useClock();
  const dayParam = useSearchParams().get("day");
  // "yyyy-mm-dd" of the picked past day, or null for today.
  const pastDayKey = selectedPastDay(dayParam, nowMs) ? dayParam : null;

  const sample = useMemo(() => {
    if (nowMs == null) return null;
    // The moment the sample is shown "as of": now, or the end of the picked day.
    const past = parseDayKey(pastDayKey);
    const asOf = past ? endOfDay(past) : new Date(nowMs);
    const orders = getSampleOrders(asOf);
    return {
      stats: getOrderStats(orders, asOf),
      days: getDailySales(orders, asOf, Boolean(past)),
      topSelling: getTopSelling(orders, asOf),
      recent: getRecentOrders(orders),
      deliveries: getActiveDeliveries(orders),
    };
  }, [nowMs, pastDayKey]);

  const alerts = useMemo(
    () =>
      products
        ?.filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name)),
    [products]
  );
  const productsById = useMemo(() => (products ? new Map(products.map((p) => [p.id, p])) : null), [products]);

  if (!sample) return null; // server render only: the admin shows in the browser

  const name = displayName(user);
  const pastDay = parseDayKey(pastDayKey);
  const viewingPast = pastDay !== null;
  const dayLabel = pastDay?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const shortLabel = pastDay?.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px]">
      <div>
        <h1 className="break-words text-[20px] font-extrabold text-[#1F2937] sm:text-[24px]">Welcome back, {name}!</h1>
        {viewingPast ? (
          <p className="mt-[2px] flex flex-wrap items-center gap-x-[8px] text-[12px] text-gray-500 sm:text-[13px]">
            <span>
              Showing <span className="font-semibold text-[#1F2937]">{dayLabel}</span>, as of the end of the day.
            </span>
            <Link href="/admin" className="font-semibold text-[#2F5D3A] hover:underline">
              Back to today
            </Link>
          </p>
        ) : (
          <p className="mt-[2px] text-[12px] text-gray-500 sm:text-[13px]">Here is what&apos;s happening with FreshMart today.</p>
        )}
      </div>

      <StatCards stats={sample.stats} compareLabel={viewingPast ? "vs day before" : "vs yesterday"} />

      <div className="grid gap-[12px] md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr]">
        <div className="min-w-0 md:col-span-2 xl:col-span-1">
          {/* Keyed by day, so a hovered point from another day doesn't carry over. */}
          <SalesChart key={dayLabel ?? "today"} days={sample.days} />
        </div>
        <TopSelling
          items={sample.topSelling}
          productsById={productsById}
          periodLabel={viewingPast ? `in the week to ${shortLabel}` : "this week"}
        />
        <LowStock alerts={alerts} total={products?.length ?? 0} error={products === undefined ? loadError : null} onRetry={reloadProducts} />
      </div>

      <RecentOrders orders={sample.recent} now={new Date(nowMs)} />
      <ActiveDeliveries
        orders={sample.deliveries}
        emptyText={viewingPast ? "No deliveries were still on the road at the end of this day." : undefined}
      />
    </div>
  );
}
