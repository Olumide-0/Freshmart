"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { selectedPastDay, toDayKey, useClock } from "@/lib/admin/useClock";
import { useDismiss } from "@/components/admin/overview/parts";

// Header date pill: live date and time (ticks every minute). Click for a month
// calendar; picking a past day opens the Overview for that day
// (/admin?day=yyyy-mm-dd), and "Today" goes back to /admin.

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const dayOf = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
const monthOf = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const sameDay = (a, b) => a.getTime() === b.getTime(); // both at local midnight

const shortDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const longDate = (date) =>
  date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

export default function DatePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const dayParam = useSearchParams().get("day");
  const nowMs = useClock();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);
  const triggerRef = useRef(null);

  if (nowMs == null) {
    return <span className="h-[40px] w-[200px] rounded-full border border-gray-200 bg-white" aria-hidden="true" />;
  }

  const now = new Date(nowMs);
  const today = dayOf(now);
  // The picked day only applies to the Overview.
  const picked = pathname === "/admin" ? selectedPastDay(dayParam, nowMs) : null;
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const closeAndFocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  const choose = (day) => {
    setOpen(false);
    router.push(sameDay(day, today) ? "/admin" : `/admin?day=${toDayKey(day)}`);
  };

  return (
    <div ref={ref} className="relative">
      <div
        className={`flex h-[40px] items-center rounded-full border ${
          picked ? "border-[#2F5D3A]/30 bg-[#E6F0E1]" : "border-gray-200 bg-white"
        }`}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={
            picked
              ? `Showing ${longDate(picked)}. Choose a day`
              : `Today, ${longDate(today)}, ${time}. Choose a day`
          }
          className={`flex h-full items-center gap-[8px] whitespace-nowrap rounded-full pl-[14px] text-[13px] font-semibold ${
            picked ? "pr-[6px] text-[#2F5D3A]" : "pr-[14px] text-[#1F2937]"
          }`}
        >
          <CalendarDays className={`h-[16px] w-[16px] ${picked ? "text-[#2F5D3A]" : "text-gray-500"}`} strokeWidth={2} />
          {picked ? (
            <time dateTime={toDayKey(picked)}>{shortDate(picked)}</time>
          ) : (
            <time dateTime={`${toDayKey(now)}T${now.toTimeString().slice(0, 5)}`}>
              {shortDate(now)}
              <span className="text-gray-400"> · </span>
              {time}
            </time>
          )}
        </button>
        {picked && (
          <button
            type="button"
            onClick={() => router.push("/admin")}
            aria-label="Back to today"
            title="Back to today"
            className="mr-[6px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[#2F5D3A] hover:bg-white/70"
          >
            <X className="h-[14px] w-[14px]" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {open && (
        <MonthCalendar
          today={today}
          selected={picked ?? today}
          onPick={choose}
          onEscape={closeAndFocus}
        />
      )}
    </div>
  );
}

function MonthCalendar({ today, selected, onPick, onEscape }) {
  const [view, setView] = useState(() => monthOf(selected));
  const [focused, setFocused] = useState(selected);
  const gridRef = useRef(null);

  // Keep keyboard focus on the focused day (also on open, and after paging months).
  useEffect(() => {
    gridRef.current?.querySelector('[data-focused="true"]')?.focus();
  }, [focused, view]);

  const first = monthOf(view);
  const start = addDays(first, -first.getDay()); // Sunday on or before the 1st
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i)); // 6 weeks, steady height
  const atCurrentMonth = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
  const monthLabel = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const showMonth = (offset) => {
    const next = new Date(view.getFullYear(), view.getMonth() + offset, 1);
    setView(next);
    // Focus the same day number in the new month (not past today).
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    const day = new Date(next.getFullYear(), next.getMonth(), Math.min(focused.getDate(), lastDay));
    setFocused(day > today ? today : day);
  };

  const move = (days) => {
    const next = addDays(focused, days);
    if (next > today) return;
    setFocused(next);
    if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) setView(monthOf(next));
  };

  const onKeyDown = (e) => {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in steps) {
      e.preventDefault();
      move(steps[e.key]);
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      if (e.key === "PageUp" || !atCurrentMonth) showMonth(e.key === "PageUp" ? -1 : 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Choose a day"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation(); // handled here, so focus can go back to the pill
          onEscape();
        }
      }}
      className="absolute left-0 top-[calc(100%+8px)] z-40 w-[280px] max-w-[calc(100vw-32px)] rounded-[12px] border border-black/5 bg-white p-[12px] shadow-lg lg:left-auto lg:right-0"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => showMonth(-1)}
          aria-label="Previous month"
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#1F2937] hover:bg-black/5"
        >
          <ChevronLeft className="h-[16px] w-[16px]" strokeWidth={2.25} />
        </button>
        <p className="text-[14px] font-bold text-[#1F2937]" aria-live="polite">{monthLabel}</p>
        <button
          type="button"
          onClick={() => showMonth(1)}
          disabled={atCurrentMonth}
          aria-label="Next month"
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#1F2937] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2.25} />
        </button>
      </div>

      <div className="mt-[8px] grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-[4px]">{d}</span>
        ))}
      </div>

      <div ref={gridRef} role="group" aria-label={monthLabel} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-y-[2px]">
        {cells.map((day) => {
          const future = day > today;
          const inMonth = day.getMonth() === view.getMonth();
          const isSelected = sameDay(day, selected);
          const isToday = sameDay(day, today);
          const isFocused = sameDay(day, focused);
          return (
            <button
              key={day.getTime()}
              type="button"
              data-focused={isFocused}
              tabIndex={isFocused ? 0 : -1}
              disabled={future}
              onClick={() => onPick(day)}
              aria-label={`${longDate(day)}${isToday ? ", today" : ""}`}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              className={`mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[#C6672E] ${
                isSelected
                  ? "bg-[#2F5D3A] font-bold text-white"
                  : future
                    ? "cursor-not-allowed text-gray-300"
                    : `hover:bg-[#E6F0E1] ${inMonth ? "text-[#1F2937]" : "text-gray-400"}`
              } ${isToday && !isSelected ? "font-bold ring-1 ring-[#2F5D3A]" : ""}`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-[8px] flex items-center justify-between border-t border-black/5 pt-[8px]">
        <p className="text-[11px] text-gray-400">Future days can’t be picked</p>
        <button
          type="button"
          onClick={() => onPick(today)}
          className="rounded-full px-[12px] py-[6px] text-[13px] font-semibold text-[#2F5D3A] hover:bg-[#E6F0E1]"
        >
          Today
        </button>
      </div>
    </div>
  );
}
