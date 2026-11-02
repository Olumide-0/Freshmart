"use client";

import { X, MapPin, Plus, Minus, LocateFixed, MessageCircle, Phone, Truck, Check, Circle } from "lucide-react";
import { useEffect, useState } from "react";

import { useOrderStore } from "@/store/useOrderStore";
import { getTrackingState, STAGE_OFFSETS_MS } from "@/lib/trackingDemo";

// The route drawn in the SVG below (viewBox 0 0 500 300) as its three cubic
// Bézier segments. Keep in sync with the <path d="..."> if the route changes.
const ROUTE_SEGMENTS = [
  [[100, 245], [130, 225], [160, 210], [205, 195]],
  [[205, 195], [250, 180], [290, 160], [330, 145]],
  [[330, 145], [370, 125], [400, 105], [420, 80]],
];

const bezierPoint = ([p0, p1, p2, p3], t) => {
  const u = 1 - t;
  return [0, 1].map(
    (axis) =>
      u * u * u * p0[axis] +
      3 * u * u * t * p1[axis] +
      3 * u * t * t * p2[axis] +
      t * t * t * p3[axis]
  );
};

// Points sampled along the route with their running length, so equal
// progress means equal distance along the line (even truck speed).
const ROUTE_SAMPLES = (() => {
  const samples = [];
  let length = 0;
  let previous = null;

  ROUTE_SEGMENTS.forEach((segment) => {
    for (let step = 0; step <= 50; step++) {
      const point = bezierPoint(segment, step / 50);
      if (previous) {
        length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
      }
      samples.push({ point, length });
      previous = point;
    }
  });

  return samples;
})();

const ROUTE_LENGTH = ROUTE_SAMPLES[ROUTE_SAMPLES.length - 1].length;

// Point on the route for progress 0-1, as percentages of the map box.
function getRoutePosition(progress) {
  const target = Math.min(1, Math.max(0, progress)) * ROUTE_LENGTH;
  const index = ROUTE_SAMPLES.findIndex((sample) => sample.length >= target);
  const next = ROUTE_SAMPLES[index];
  const prev = ROUTE_SAMPLES[Math.max(0, index - 1)];
  const span = next.length - prev.length;
  const t = span > 0 ? (target - prev.length) / span : 0;

  return {
    left: ((prev.point[0] + (next.point[0] - prev.point[0]) * t) / 500) * 100,
    top: ((prev.point[1] + (next.point[1] - prev.point[1]) * t) / 300) * 100,
  };
}

// Discrete zoom steps for the map drawing layer (100% to 200%).
const ZOOM_CLASSES = ["scale-100", "scale-125", "scale-150", "scale-175", "scale-200"];

const TIMELINE_STEPS = [
  {
    title: "Order Confirmed",
    description: "Your order has been received and verified by FreshMart",
  },
  {
    title: "Preparing Your Items",
    description: "Fresh items are being hand-picked and safely packed",
  },
  {
    title: "Out for Delivery",
    description: "Carlos Rodriguez is on his way to your nearest spot with your basket",
  },
  {
    title: "Delivered",
    description: "Securely received and left at your doorstep",
  },
];

// Class strings copied unchanged from the original done / current / pending steps.
const STEP_STYLES = {
  done: {
    badge: "z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#E7F1E3]",
    title: "text-[10px] font-semibold text-gray-800",
    time: "text-[8px] text-gray-400",
    description: "mt-0.5 text-[8px] text-gray-500",
  },
  current: {
    badge: "z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#3E5730] bg-[#3E5730]",
    title: "text-[10px] font-bold text-[#3E5730]",
    time: "text-[8px] text-[#3E5730]",
    description: "mt-0.5 text-[8px] text-gray-600",
  },
  pending: {
    badge: "z-10 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white",
    title: "text-[10px] font-medium text-gray-400",
    time: "text-[8px] text-gray-400",
    description: "mt-0.5 text-[8px] text-gray-400",
  },
};

const STEP_ICONS = {
  done: <Check className="h-3 w-3 text-[#3E5730]" />,
  current: <Circle className="h-2 w-2 fill-white text-white" />,
  pending: <Circle className="h-2 w-2 fill-gray-300 text-gray-300" />,
};

const CONNECTOR_DONE = "absolute top-5 h-9 w-[2px] bg-[#6D9A5A]";
const CONNECTOR_PENDING = "absolute top-5 h-9 w-[2px] border-l border-dashed border-gray-300";

const formatClock = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const formatRemaining = (seconds) =>
  `${Math.floor(seconds / 60)} min ${String(seconds % 60).padStart(2, "0")} sec remaining`;


export default function TrackOrderModal({ onClose }) {

  const orderNumber = useOrderStore((state) => state.orderNumber)
  const deliveryData = useOrderStore((state) => state.deliveryData)
  const orderPlacedAt = useOrderStore((state) => state.orderPlacedAt)

  // { startedAt, now }; set only from timer callbacks, never during render.
  const [clock, setClock] = useState(null);
  const [zoomStep, setZoomStep] = useState(0);

  useEffect(() => {
    // Older orders saved before orderPlacedAt existed start when the modal opens.
    const startedAt = orderPlacedAt || Date.now();
    let intervalId;

    const tick = () => {
      const now = Date.now();
      setClock({ startedAt, now });

      if (getTrackingState(now - startedAt).isDelivered) {
        clearInterval(intervalId);
      }
    };

    const firstTickId = setTimeout(tick, 0);
    intervalId = setInterval(tick, 1000);

    return () => {
      clearTimeout(firstTickId);
      clearInterval(intervalId);
    };
  }, [orderPlacedAt]);

  // Wait for the first tick so the truck appears in place instead of sliding there.
  if (!clock) {
    return null;
  }

  const tracking = getTrackingState(clock.now - clock.startedAt);
  const truckPosition = getRoutePosition(tracking.routeProgress);
  const isOutForDelivery = tracking.stageIndex >= 2 && !tracking.isDelivered;

  const getStepState = (index) => {
    if (tracking.isDelivered || index < tracking.stageIndex) return "done";
    return index === tracking.stageIndex ? "current" : "pending";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[24px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 sm:px-6">
          <h2 className="text-[20px] font-bold text-[#1F2937] underline decoration-[#17823B] decoration-[3px] underline-offset-2">
            Track order
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#1F2937]"
            aria-label="Close tracking modal"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Main content */}
        <div className="grid gap-3 px-6 py-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT - MAP */}
          <div className="relative h-[300px] overflow-hidden rounded-[16px] bg-[#eef1ec]">
            {/* Map drawing layer: the only part that zooms */}
            <div className={`absolute inset-0 transition-transform duration-300 ${ZOOM_CLASSES[zoomStep]}`}>
            {/* Fake map background */}
            <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_45%,#d9ded8_46%,#d9ded8_48%,transparent_49%),linear-gradient(120deg,transparent_45%,#d9ded8_46%,#d9ded8_48%,transparent_49%)] bg-[length:90px_90px]" />

            {/* Green areas */}
            <div className="absolute left-[42%] top-0 h-[90px] w-[70px] rotate-[15deg] bg-[#dcebd2]" />
            <div className="absolute right-[8%] top-[10%] h-[70px] w-[80px] rotate-[25deg] bg-[#dcebd2]" />
            <div className="absolute left-[20%] bottom-[5%] h-[80px] w-[120px] rotate-[-10deg] bg-[#dcebd2]" />

            {/* Map labels */}
            <span className="absolute left-[28%] top-[11%] text-[8px] font-medium text-gray-500">
              ROMA NORTE
            </span>
            <span className="absolute left-[5%] top-[27%] text-[8px] font-medium text-gray-500">
              CONDESA
            </span>
            <span className="absolute left-[5%] top-[48%] text-[8px] font-medium text-gray-500">
              HIPÓDROMO
              <br />
              CONDESA
            </span>
            <span className="absolute left-[39%] bottom-[22%] text-[8px] font-medium text-gray-500">
              ROMA SUR
            </span>

            {/* Route */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 500 300"
              preserveAspectRatio="none"
            >
              <path
                d="M100 245 C130 225, 160 210, 205 195 C250 180, 290 160, 330 145 C370 125, 400 105, 420 80"
                fill="none"
                stroke="#236B2D"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            {/* Destination marker */}
            <div className="absolute right-[15%] top-[9%] z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#176B2C] text-white shadow-md">
              <MapPin className="h-5 w-5 fill-white" />
            </div>

            {/* Current location */}
            <div className="absolute left-[18%] bottom-[15%] flex h-4 w-4 items-center justify-center rounded-full border-[3px] border-[#6DBB43] bg-white" />

            {/* Truck: position along the route changes every tick, so left/top
                are the one inline style (no fixed class can express them) */}
            <div
              className="absolute flex h-10 w-14 -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] items-center justify-center rounded-md bg-[#1D642C] text-white shadow-lg transition-all duration-1000 ease-linear"
              style={{ left: `${truckPosition.left}%`, top: `${truckPosition.top}%` }}
            >
              <Truck className="h-6 w-6" />
            </div>
            </div>

            {/* Live tracking badge */}
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold shadow-sm">
              {tracking.isDelivered ? (
                <>
                  <Check className="h-3 w-3 text-[#3E9B36]" />
                  Delivered
                </>
              ) : (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#3E9B36]" />
                  Live Tracking
                </>
              )}
            </div>

            {/* Zoom controls */}
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white shadow-md">
              <button
                onClick={() => setZoomStep((step) => Math.min(ZOOM_CLASSES.length - 1, step + 1))}
                disabled={zoomStep === ZOOM_CLASSES.length - 1}
                aria-label="Zoom in"
                className="flex h-10 w-10 cursor-pointer items-center justify-center border-b text-gray-600 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                onClick={() => setZoomStep((step) => Math.max(0, step - 1))}
                disabled={zoomStep === 0}
                aria-label="Zoom out"
                className="flex h-10 w-10 cursor-pointer items-center justify-center text-gray-600 disabled:cursor-not-allowed"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>

            {/* Locate button */}
            <button
              onClick={() => setZoomStep(0)}
              aria-label="Reset zoom"
              className="absolute bottom-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
            >
              <LocateFixed className="h-5 w-5 text-gray-700" />
            </button>

            {/* Distance card */}
            <div className="absolute bottom-3 left-3 rounded-xl bg-white px-3 py-2 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF7EC]">
                  <Truck className="h-5 w-5 text-[#236B2D]" />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#236B2D]">
                    {tracking.isDelivered
                      ? "Delivered"
                      : isOutForDelivery
                        ? `${tracking.kmAway.toFixed(1)} km away`
                        : "Preparing your order"}
                  </p>
                  <p className="text-[9px] text-gray-700">
                    {tracking.isDelivered
                      ? "Arrived at your address"
                      : isOutForDelivery
                        ? formatRemaining(tracking.remainingSeconds)
                        : "Courier leaves soon"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - ORDER DETAILS */}
          <div className="flex h-[300px] flex-col rounded-[16px] bg-[#F8F5EC] px-3 py-3">
            {/* Order information */}
            <div className="rounded-xl border border-[#E8DDC7] px-3 py-2">
              <div className="flex justify-between text-[9px]">
                <span className="font-medium uppercase tracking-wide text-gray-400">
                  Order number
                </span>
                <span className="font-bold text-[#3E5730]">#{orderNumber}</span>
              </div>

              <div className="mt-2 flex justify-between text-[9px]">
                <span className="font-medium uppercase tracking-wide text-gray-400">
                  Estimated delivery
                </span>
                <span className="font-bold text-gray-800">
                  {deliveryData.deliveryTime}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-2 flex-1">
              {TIMELINE_STEPS.map((step, index) => {
                const state = getStepState(index);
                const styles = STEP_STYLES[state];
                const isLast = index === TIMELINE_STEPS.length - 1;
                const time = formatClock(clock.startedAt + STAGE_OFFSETS_MS[index]);

                // The last step has no connector, no "relative" and no bottom padding (as before).
                return (
                  <div key={step.title} className={isLast ? "flex gap-3" : "relative flex gap-3"}>
                    <div className={isLast ? "flex w-5 justify-center" : "relative flex w-5 justify-center"}>
                      <div className={styles.badge}>
                        {STEP_ICONS[state]}
                      </div>

                      {!isLast && (
                        <div className={state === "done" ? CONNECTOR_DONE : CONNECTOR_PENDING} />
                      )}
                    </div>

                    <div className={isLast ? "flex-1" : "flex-1 pb-3"}>
                      <div className="flex justify-between">
                        <p className={styles.title}>
                          {step.title}
                        </p>
                        <span className={styles.time}>
                          {index <= tracking.stageIndex ? time : `Est. ${time}`}
                        </span>
                      </div>
                      <p className={styles.description}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Courier */}
            <div className="mt-1 flex items-center justify-between border-t border-[#E5DDCE] pt-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#D8E5D1] text-[9px] font-bold text-[#3E5730]">
                  CR
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-800">
                    Carlos Rodriguez
                  </p>
                  <p className="text-[8px] text-gray-500">
                    ⭐ 4.9 • FreshMart Courier
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white">
                  <MessageCircle className="h-4 w-4 text-gray-700" />
                </button>

                <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#3E5730]">
                  <Phone className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-[10px] sm:px-6">
          <span className="text-gray-500">
            Having trouble with your delivery?
          </span>

          <button className="flex cursor-pointer items-center gap-1 font-semibold text-[#C6672E]">
            Contact Support
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}