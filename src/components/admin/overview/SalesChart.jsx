"use client";

import { useEffect, useRef, useState } from "react";
import { Card, SampleTag, formatAmount } from "@/components/admin/overview/parts";

const HEIGHT = 200;
const PAD = { top: 16, right: 12, bottom: 28, left: 44 };

// Width of an element, kept up to date (so the SVG is drawn at real pixel size
// instead of being stretched).
function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

const TICKS = 4;

// Top of the y axis: 4 equal steps of a tidy size (1, 1.5, 2, 2.5 ... 10 x 10^n),
// e.g. a 4,200 peak -> steps of 1,500 -> max 6,000.
function niceMax(value) {
  if (value <= 0) return 100 * TICKS;
  const rough = value / TICKS;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((m) => m * magnitude).find((s) => s >= rough);
  return step * TICKS;
}

const shortMoney = (v) => (v >= 1000 ? `$${+(v / 1000).toFixed(1)}k` : `$${v}`);

// days: [{ date, revenue }] for 7 days, oldest first (sample data). The last
// day is shown until another point is hovered or tapped.
export default function SalesChart({ days }) {
  const [boxRef, width] = useWidth();
  const [active, setActive] = useState(null);

  const max = niceMax(Math.max(...days.map((d) => d.revenue)));
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (days.length > 1 ? (i / (days.length - 1)) * innerW : innerW / 2);
  const y = (v) => PAD.top + innerH - (v / max) * innerH;
  const points = days.map((d, i) => [x(i), y(d.revenue)]);
  const line = points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const area = points.length
    ? `${line} L${points.at(-1)[0].toFixed(1)},${PAD.top + innerH} L${points[0][0].toFixed(1)},${PAD.top + innerH} Z`
    : "";
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => (max / TICKS) * i);
  const total = days.reduce((s, d) => s + d.revenue, 0);
  const shown = active ?? days.length - 1;

  return (
    <Card className="flex min-w-0 flex-col p-[16px] sm:p-[20px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-[15px] font-extrabold text-[#1F2937]">Sales Overview</h2>
            <SampleTag />
          </div>
          <p className="mt-[2px] text-[11px] text-gray-500">Daily performance of physical &amp; digital sales</p>
        </div>
        <span className="flex shrink-0 items-center gap-[6px] text-[11px] text-gray-500">
          <span className="h-[8px] w-[8px] rounded-full bg-[#2F5D3A]" aria-hidden="true" />
          Online Store
        </span>
      </div>

      <p className="mt-[10px] text-[12px] text-gray-500">
        <span className="font-semibold text-[#1F2937]">
          {days[shown].date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}:
        </span>{" "}
        ${formatAmount(days[shown].revenue)} MXN
        <span className="text-gray-400"> · week total ${formatAmount(total)} MXN</span>
      </p>

      <div ref={boxRef} className="mt-[8px] w-full">
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            role="img"
            aria-label={`Sales for 7 days: ${days
              .map((d) => `${d.date.toLocaleDateString("en-US", { weekday: "short" })} $${formatAmount(d.revenue)}`)
              .join(", ")}`}
            onMouseLeave={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="stroke-gray-100" />
                <text x={PAD.left - 8} y={y(t) + 3} textAnchor="end" className="fill-gray-400 text-[10px]">
                  {shortMoney(t)}
                </text>
              </g>
            ))}

            <path d={area} className="fill-[#2F5D3A]/10" />
            <path d={line} fill="none" className="stroke-[#2F5D3A]" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {days.map((d, i) => (
              <g key={d.date.toISOString()}>
                {/* Wide invisible hit area per day for hover/tap. */}
                <rect
                  x={x(i) - innerW / (days.length - 1 || 1) / 2}
                  y={PAD.top}
                  width={innerW / (days.length - 1 || 1)}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                />
                {shown === i && (
                  <line x1={x(i)} x2={x(i)} y1={PAD.top} y2={PAD.top + innerH} className="stroke-[#2F5D3A]/30" strokeDasharray="3 3" />
                )}
                <circle
                  cx={x(i)}
                  cy={y(d.revenue)}
                  r={shown === i ? 5 : 3.5}
                  className={shown === i ? "fill-[#2F5D3A] stroke-white" : "fill-white stroke-[#2F5D3A]"}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <text x={x(i)} y={HEIGHT - 8} textAnchor="middle" className="fill-gray-400 text-[10px]">
                  {d.date.toLocaleDateString("en-US", { weekday: "short" })}
                </text>
              </g>
            ))}
          </svg>
        )}
        {width === 0 && <div className="h-[200px]" aria-hidden="true" />}
      </div>
    </Card>
  );
}
