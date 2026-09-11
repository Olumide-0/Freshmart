"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Leaf,
  Scale,
  ShoppingBasket,
  Trash,
  Lock,
} from "lucide-react";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";

import veggieCrate from "../../assets/image/image 166.png";


export default function BasketSummary({
  subtotal,
  totalWeight,
  agreed,
  setAgreed,  
  clearCart,
  handleCheckout,
  isCheckout = false,
  isConfirmation = false,
  deliveryFee = 0,
  tax = 0,
  onContinueToPayment,
  onContinueToTrack,
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [tipOption, setTipOption] = useState("");
  

  const tip = useOrderStore((state) => state.tip);
  const setTip = useOrderStore((state) => state.setTip);

  const estimatedTotal = subtotal + deliveryFee + tax + tip;
  const handleTipChange = (amount, option) => {
    setTip(amount);
    setTipOption(option);
  };
  return (
    <div className="flex w-full shrink-0 flex-col gap-[16px] overflow-hidden rounded-[8px] bg-white p-[20px] sm:p-[24px] lg:w-[380px]">
      <h2 className="text-[18px] font-extrabold text-[#1F2937]">
        Basket summary
      </h2>

      {/* Basket image + basket details */}
      <div className="relative -ml-[20px] flex items-center justify-between gap-[16px] sm:-ml-[24px]">
        <div className="relative h-[180px] w-[100px] shrink-0 overflow-hidden sm:w-[110px]">
          <Image
            src={veggieCrate}
            alt="Basket"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-[20px] pr-[4px]">
          <div className="flex">
            {/* Freshness */}
            <div className="flex items-center gap-[10px]">
              <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#E6F0E1]">
                <Leaf
                  className="h-[15px] w-[15px] text-[#3E5730]"
                  strokeWidth={2}
                />
              </span>

              <span className="text-[13px] leading-tight text-[#1F2937]">
                <span className="block text-[14px] font-extrabold">
                  48hrs
                </span>
                <span className="text-gray-500">Freshness</span>
              </span>
            </div>

            {/* Total weight */}
            <div className="flex items-center gap-[10px]">
              <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#E6F0E1]">
                <Scale
                  className="h-[15px] w-[15px] text-[#3E5730]"
                  strokeWidth={2}
                />
              </span>

              <span className="text-[13px] leading-tight text-[#1F2937]">
                <span className="block text-[14px] font-extrabold">
                  {totalWeight} kg
                </span>
                <span className="text-gray-500">Total weight</span>
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* Order Summary */}
          <div className="flex flex-col gap-[10px] text-[14px]">
            {/* Subtotal */}
            <div className="flex items-center justify-between gap-10">
              <span className="text-[16px] text-gray-500">Subtotal</span>

              <span className="font-semibold text-[#1F2937]">
                ${subtotal}
                <sup className="text-[10px]">MXN</sup>
              </span>
            </div>

            {/* Delivery */}
            <div className="flex items-center justify-between gap-8">
              <span className="text-[16px] text-gray-500">Delivery</span>

              <span className="text-[16px] text-gray-500">
                {isCheckout || isConfirmation ? (
                  <>
                    ${deliveryFee}
                    <sup className="text-[10px]">MXN</sup>
                  </>
                ) : (
                  "Calculated at checkout"
                )}
              </span>
            </div>

            {/* Taxes */}
            <div className="flex items-center justify-between gap-8">
              <span className="text-[16px] text-gray-500">Taxes</span>

              <span className="text-[16px] text-gray-500">
                {isCheckout || isConfirmation ? (
                  <>
                    ${tax}
                    <sup className="text-[10px]">MXN</sup>
                  </>
                ) : (
                  "Calculated at checkout"
                )}
              </span>
            </div>

            {/* Tip - Checkout only */}
            {(isCheckout || isConfirmation) && (
              <div className="flex items-center justify-between gap-8">
                <span className="text-[16px] text-gray-500">Tip</span>

                <span className="font-semibold text-[#1F2937]">
                  ${tip}
                  <sup className="text-[10px]">MXN</sup>
                </span>
              </div>
            )}
          </div>

          {/* Estimated Total */}
          <div className="flex items-center justify-between gap-10 border-t border-gray-100 pt-[16px]">
            <span className="text-[15px] font-bold text-[#1F2937]">
              Estimated Total
            </span>

            <span className="text-[20px] font-extrabold text-[#1F2937]">
              ${isCheckout || isConfirmation ? estimatedTotal : subtotal}
              <sup className="text-[11px]">MXN</sup>
            </span>
          </div>

          {/* Delivery Tip - Checkout only */}
          {isCheckout && (
            <div className="flex w-full flex-col gap-[10px]">
              <span className="text-[15px] font-semibold text-[#1F2937]">
                Delivery Tip
              </span>

              <div className="flex items-center gap-[8px]">
                {/* $1 */}
                <button
                  type="button"
                  onClick={() => handleTipChange(1, "$1")}
                  className={`flex-1 rounded-[8px] border py-[10px] text-[14px] font-semibold cursor-pointer ${tipOption === "$1"
                      ? "border-[#3E5730] bg-[#E6F0E1] text-[#3E5730]"
                      : "border-gray-200 text-[#1F2937]"
                    }`}
                >
                  $1
                </button>

                {/* $2 */}
                <button
                  type="button"
                  onClick={() => handleTipChange(2, "$2")}
                  className={`flex-1 rounded-[8px] border py-[10px] text-[14px] font-semibold cursor-pointer ${tipOption === "$2"
                      ? "border-[#3E5730] bg-[#E6F0E1] text-[#3E5730]"
                      : "border-gray-200 text-[#1F2937]"
                    }`}
                >
                  $2
                </button>

                {/* Custom */}
                <button
                  type="button"
                  onClick={() => handleTipChange(0, "Custom")}
                  className={`flex-1 rounded-[8px] border py-[10px] text-[14px] font-semibold cursor-pointer ${tipOption === "Custom"
                      ? "border-[#3E5730] bg-[#E6F0E1] text-[#3E5730]"
                      : "border-gray-200 text-[#1F2937]"
                    }`}
                >
                  Custom
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CART ONLY */}
      {!isCheckout && !isConfirmation && (
        <>
          {/* Continue shopping + More */}
          <div className="relative flex gap-[10px]">
            <Link
              href="/"
              className="flex-1 rounded-[8px] bg-[#3E5730] py-[12px] text-center text-[16px] font-semibold text-white sm:py-[13px]"
            >
              Continue shopping
            </Link>

            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="rounded-[8px] bg-[#E9E4D8] px-[16px] py-[12px] text-[16px] font-semibold text-[#1F2937] sm:px-[18px] sm:py-[13px]"
            >
              ....More
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[220px] overflow-hidden rounded-[8px] bg-white shadow-xl">
                <button
                  onClick={() => setMoreOpen(false)}
                  className="flex w-full items-center justify-between px-[16px] py-[14px] text-[14px] font-semibold text-[#1F2937] hover:bg-gray-50"
                >
                  Save as food plan
                  <ShoppingBasket
                    className="h-[16px] w-[16px]"
                    strokeWidth={2}
                  />
                </button>

                <button
                  onClick={() => {
                    clearCart();
                    setMoreOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-[16px] py-[14px] text-[14px] font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete all cart item
                  <Trash className="h-[16px] w-[16px]" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {/* Return policy */}
          <label className="flex cursor-pointer items-center gap-[8px] text-[16px] text-[#1F2937]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-[16px] w-[16px] rounded-[4px] accent-[#3E5730]"
            />

            I agree to{" "}
            <span className="font-semibold underline">
              freshmart&rsquo;s return policy
            </span>
          </label>

          {/* Go to checkout */}
          <button
            onClick={handleCheckout}
            disabled={!agreed}
            className={`w-full rounded-[8px] py-[12px] text-[16px] font-semibold text-white sm:py-[14px] sm:text-[15px] cursor-pointer ${agreed
                ? "bg-[#3E5730]"
                : "cursor-not-allowed bg-[#B9C6B0]"
              }`}
          >
            Go to checkout
          </button>
        </>
      )}

      {/* CHECKOUT ONLY */}
      {isCheckout && !isConfirmation && (
        <button
          type="button"
          onClick={onContinueToPayment}
          className="w-full rounded-[8px] bg-[#3E5730] py-[12px] text-[16px] font-semibold text-white sm:py-[14px] cursor-pointer"
        >
          Continue to payment
        </button>
      )}

      {/* CONFIRMATION ONLY */}
      {isConfirmation && (
        <div className="flex flex-col gap-[10px]">
          <button
            type="button"
            onClick={onContinueToTrack}
            className="w-full rounded-[8px] bg-[#3E5730] py-[12px] text-[16px] font-semibold text-white cursor-pointer sm:py-[14px]"
          >
            Track your order
          </button>

          <Link
            href="/"
            className="flex w-full items-center justify-center text-[16px] font-semibold text-[#3E5730] underline cursor-pointer"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {/* Secure Payment Block */}
      <div className="rounded-[8px] bg-[#F6F0E3] p-[16px]">
        <div className="flex items-center gap-[6px] text-[13px] font-semibold text-[#1F2937]">
          <Lock className="h-[14px] w-[14px]" strokeWidth={2} />
          Secure payment
        </div>

        <div className="mt-[10px] flex flex-wrap items-center justify-between gap-[8px]">
          <div className="flex items-center rounded-[6px] bg-white px-[8px] py-[4px] shadow-sm">
            <span className="text-[16px] font-extrabold italic tracking-tighter text-[#1434CB]">
              VISA
            </span>
          </div>

          <div className="flex items-center gap-[2px] rounded-[6px] bg-white px-[8px] py-[4px] shadow-sm">
            <span className="text-[16px] font-bold text-[#5F6368]">G</span>
            <span className="text-[16px] font-medium text-[#5F6368]">
              Pay
            </span>
          </div>

          <div className="flex items-center rounded-[6px] bg-white px-[6px] py-[4px] shadow-sm">
            <div className="flex -space-x-[6px]">
              <div className="h-[16px] w-[16px] rounded-full bg-[#EB001B]" />
              <div className="h-[16px] w-[16px] rounded-full bg-[#F79E1B] opacity-80" />
            </div>

            <span className="ml-[4px] text-[16px] font-bold tracking-tighter text-[#222]">
              mastercard
            </span>
          </div>

          <div className="flex items-center gap-[2px] rounded-[6px] bg-white px-[8px] py-[4px] shadow-sm">
            <span className="text-[16px] font-bold text-black">Pay</span>
          </div>
        </div>
      </div>

      {/* Earliest Delivery */}
      <div className="rounded-[8px] bg-[#E6F0E1] p-[16px]">
        <p className="text-[16px] font-semibold text-[#3E5730]">
          Earliest delivery
        </p>

        <p className="mt-[4px] text-[16px] font-extrabold text-[#1F2937]">
          Today
        </p>

        <p className="text-[16px] text-[#1F2937]">2:00PM-4:00PM</p>

        <button className="mt-[8px] flex items-center gap-[4px] text-[16px] font-semibold text-[#3E5730]">
          Change delivery time
          <ChevronRight className="h-[13px] w-[13px]" strokeWidth={2} />
        </button>
      </div>

      {/* Freshness */}
      <div className="rounded-[8px] bg-[#E6F0E1] p-[16px]">
        <p className="text-[16px] font-semibold text-[#3E5730]">
          Picked within the last 24hrs
        </p>

        <p className="mt-[4px] text-[16px] font-extrabold text-[#1F2937]">
          100% freshness guaranteed
        </p>

        <button className="mt-[8px] flex items-center gap-[4px] text-[16px] font-semibold text-[#3E5730]">
          Learn more
          <ChevronRight className="h-[13px] w-[13px]" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}