"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

// Shared pieces for the admin Overview sections and header.

// Closes a dropdown on outside click or Escape. Attach the ref to the wrapper.
export function useDismiss(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);
  return ref;
}

export function Card({ children, className = "" }) {
  return <section className={`rounded-[12px] border border-black/5 bg-white ${className}`}>{children}</section>;
}

// Marks a section whose numbers come from src/lib/admin/sampleData.js.
export function SampleTag() {
  return (
    <span
      title="Sample data: there is no orders API yet"
      className="inline-flex shrink-0 items-center rounded-full border border-dashed border-gray-300 px-[6px] py-[1px] text-[10px] font-semibold uppercase tracking-wide text-gray-400"
    >
      Sample
    </span>
  );
}

// 51240 -> "51,240"; 342.5 -> "342.50"
export function formatAmount(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

// "↑ 18.6%" green when up, "↓ 4.2%" orange when down, grey dash when unknown.
export function Change({ value, suffix = "" }) {
  if (value == null || !Number.isFinite(value)) {
    return <span className="text-gray-400">—{suffix && ` ${suffix}`}</span>;
  }
  const up = value >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span className="inline-flex items-center gap-[2px] whitespace-nowrap">
      <span className={`inline-flex items-center gap-[1px] font-semibold ${up ? "text-[#2F8A3E]" : "text-[#E07B2A]"}`}>
        <Icon className="h-[11px] w-[11px]" strokeWidth={2.5} aria-hidden="true" />
        {Math.abs(value).toFixed(1)}%
        <span className="sr-only">{up ? " up" : " down"}</span>
      </span>
      {suffix && <span className="text-gray-500"> {suffix}</span>}
    </span>
  );
}

// "Today, 10:14 AM" / "Yesterday, 9:30 AM" / "Aug 15, 9:30 AM"
export function formatOrderDate(date, now = new Date()) {
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - day) / 86_400_000);
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

export function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// Small pill used by both tables.
export function Pill({ tone, children }) {
  const tones = {
    green: "bg-[#E6F0E1] text-[#2F5D3A]",
    blue: "bg-[#E3EEFB] text-[#2563A8]",
    yellow: "bg-[#FDF3D0] text-[#9A6B00]",
    orange: "bg-[#FBE9D9] text-[#C6672E]",
  };
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
