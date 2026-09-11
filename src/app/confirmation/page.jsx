
"use client";

import { Check,  } from "lucide-react";
import Link from "next/link";
// import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useState } from "react";

import BasketSummary from "@/components/cart/BasketSummary";
import TrackOrderModal from "@/components/checkout/TrackOrderModal";

const steps = [
  { label: "Cart", state: "done" },
  { label: "Delivery", state: "done" },
  { label: "Payment", state: "done" },
  { label: "Confirmation", state: "current" },
];

export default function OrderConfirmationPage() {

    // const items = useCartStore((state) => state.items);
    const deliveryData = useOrderStore((state) => state.deliveryData);
const paymentMethod = useOrderStore((state) => state.paymentMethod);

const orderNumber = useOrderStore((state) => state.orderNumber);


const [trackOpen, setTrackOpen] = useState(false)

const deliveryFee = useOrderStore((state) => state.deliveryFee);

const orderSubtotal = useOrderStore((state) => state.orderSubtotal);
const orderTotalWeight = useOrderStore(
  (state) => state.orderTotalWeight
);

const orderItems = useOrderStore((state) => state.orderItems);



  return (
    <main className="min-h-screen bg-[#F8F1E3] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <h1 className="text-2xl font-semibold text-neutral-900">
          Order Placed!
        </h1>

        {/* Stepper */}
        <ol className="mt-6 flex items-center">
          {steps.map((step, i) => (
            <li
              key={step.label}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-medium ${
                    step.state === "done" || step.state === "current"
                      ? "bg-[#2F5D3A] text-white"
                      : "border border-neutral-300 text-neutral-400"
                  }`}
                >
                  {step.state === "done" ? (
                    <Check
                      className="h-3.5 w-3.5"
                      strokeWidth={3}
                    />
                  ) : (
                    i + 1
                  )}
                </span>

                <span
                  className={`whitespace-nowrap text-sm ${
                    step.state === "current"
                      ? "font-medium text-neutral-900"
                      : "text-neutral-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <span className="mx-3 h-px flex-1 border-t border-dashed border-neutral-300" />
              )}
            </li>
          ))}
        </ol>

        {/* Main content */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-2">

            {/* Order confirmed */}
            <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">

                <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-50">
                  <Check
                    className="h-4 w-4 text-[#2F5D3A]"
                    strokeWidth={3}
                  />
                </span>

                <div>
                  <h2 className="text-base font-semibold text-neutral-900">
                    Order Confirmed!
                  </h2>

                  <p className="mt-0.5 text-sm text-neutral-500">
                    Thank you for shopping at FreshMart. Your nesting spot
                    will be stocked soon!
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Order Number
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-900">
                 #{orderNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Estimated Delivery Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-900">
                  {deliveryData.deliveryTime}
                  </p>
                </div>

              </div>

              <p className="mt-6 border-t border-neutral-100 pt-4 text-sm text-neutral-500">
                We&apos;ve sent a detailed receipt and order tracking link to{" "}
                <span className="text-neutral-900">
               {deliveryData.contactInfo}
                </span>
                . You can also keep this page open to track real-time order
                updates.
              </p>
            </section>

            {/* Shipping & billing */}
            <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">

              <h2 className="text-base font-semibold text-neutral-900">
                Shipping &amp; Billing Details
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* Delivery address */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-900">
                   {deliveryData.fullName}
                  </p>

                  <p className="text-sm text-neutral-500">
                   {deliveryData.address1}
  {deliveryData.address2 && `, ${deliveryData.address2}`}
  {deliveryData.city && `, ${deliveryData.city}`}
  {deliveryData.postalCode && `, ${deliveryData.postalCode}`}
                  </p>
                </div>

                {/* Payment method */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Payment Method
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="flex h-5 w-8 flex-none items-center justify-center rounded bg-[#1A1F71] text-[9px] font-bold italic text-white">
                      VISA
                    </span>

                    <span className="text-sm font-medium text-neutral-900">
                    {paymentMethod}
                    </span>

                  </div>

                  <p className="text-sm text-neutral-500">
                    Authorized &amp; Secured
                  </p>
                </div>

              </div>

            
        
            </section>
  {/* Freshness guarantee */} 
            <div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50/70 px-4 py-3">

                <Check
                  className="mt-0.5 h-4 w-4 flex-none text-[#2F5D3A]"
                  strokeWidth={3}
                />

                <p className="text-sm text-neutral-700">
                  <span className="font-medium text-neutral-900">
                    100% Freshness Guarantee
                  </span>{" "}
                  — Harvested, carefully packaged, and delivered fresh to
                  your nesting spot. If anything isn&apos;t perfect, we&apos;ll
                  make it right instantly.
                </p>
 
              </div>
          </div>

          {/* RIGHT COLUMN — BASKET SUMMARY */}
       <BasketSummary
  subtotal={orderSubtotal}
  totalWeight={orderTotalWeight}
  deliveryFee={deliveryFee}
   onContinueToTrack={() => setTrackOpen(true)}
//   tip={tip}
  isConfirmation={true}
/>
        </div>
      </div>

      {trackOpen && (
  <TrackOrderModal
    onClose={() => setTrackOpen(false)}
  />
)}
    </main>
  );
}

