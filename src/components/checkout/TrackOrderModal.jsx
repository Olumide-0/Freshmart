"use client";

import { X, MapPin, Plus, Minus, LocateFixed, MessageCircle, Phone, Truck, Check, Circle } from "lucide-react";
import { useState } from "react";

import { useOrderStore } from "@/store/useOrderStore";


export default function TrackOrderModal({ onClose }) {

  const orderNumber = useOrderStore((state) => state.orderNumber)
  const deliveryData = useOrderStore((state) => state.deliveryData)
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
            <div className="absolute right-[15%] top-[9%] flex h-8 w-8 items-center justify-center rounded-full bg-[#176B2C] text-white shadow-md">
              <MapPin className="h-5 w-5 fill-white" />
            </div>

            {/* Current location */}
            <div className="absolute left-[18%] bottom-[15%] flex h-4 w-4 items-center justify-center rounded-full border-[3px] border-[#6DBB43] bg-white" />

            {/* Truck */}
            <div className="absolute left-[48%] top-[45%] flex h-10 w-14 rotate-[-10deg] items-center justify-center rounded-md bg-[#1D642C] text-white shadow-lg">
              <Truck className="h-6 w-6" />
            </div>

            {/* Live tracking badge */}
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#3E9B36]" />
              Live Tracking
            </div>

            {/* Zoom controls */}
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white shadow-md">
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center border-b text-gray-600">
                <Plus className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center text-gray-600">
                <Minus className="h-5 w-5" />
              </button>
            </div>

            {/* Locate button */}
            <button className="absolute bottom-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md">
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
                    2.3 km away
                  </p>
                  <p className="text-[9px] text-gray-700">
                    8 minutes remaining
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
              {/* Confirmed */}
              <div className="relative flex gap-3">
                <div className="relative flex w-5 justify-center">
                  <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#E7F1E3]">
                    <Check className="h-3 w-3 text-[#3E5730]" />
                  </div>

                  <div className="absolute top-5 h-9 w-[2px] bg-[#6D9A5A]" />
                </div>

                <div className="flex-1 pb-3">
                  <div className="flex justify-between">
                    <p className="text-[10px] font-semibold text-gray-800">
                      Order Confirmed
                    </p>
                    <span className="text-[8px] text-gray-400">3:45 PM</span>
                  </div>
                  <p className="mt-0.5 text-[8px] text-gray-500">
                    Your order has been received and verified by FreshMart
                  </p>
                </div>
              </div>

              {/* Preparing */}
              <div className="relative flex gap-3">
                <div className="relative flex w-5 justify-center">
                  <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#E7F1E3]">
                    <Check className="h-3 w-3 text-[#3E5730]" />
                  </div>

                  <div className="absolute top-5 h-9 w-[2px] bg-[#6D9A5A]" />
                </div>

                <div className="flex-1 pb-3">
                  <div className="flex justify-between">
                    <p className="text-[10px] font-semibold text-gray-800">
                      Preparing Your Items
                    </p>
                    <span className="text-[8px] text-gray-400">4:02 PM</span>
                  </div>
                  <p className="mt-0.5 text-[8px] text-gray-500">
                    Fresh items are being hand-picked and safely packed
                  </p>
                </div>
              </div>

              {/* Out for delivery */}
              <div className="relative flex gap-3">
                <div className="relative flex w-5 justify-center">
                  <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#3E5730] bg-[#3E5730]">
                    <Circle className="h-2 w-2 fill-white text-white" />
                  </div>

                  <div className="absolute top-5 h-9 w-[2px] border-l border-dashed border-gray-300" />
                </div>

                <div className="flex-1 pb-3">
                  <div className="flex justify-between">
                    <p className="text-[10px] font-bold text-[#3E5730]">
                      Out for Delivery
                    </p>
                    <span className="text-[8px] text-[#3E5730]">4:15 PM</span>
                  </div>
                  <p className="mt-0.5 text-[8px] text-gray-600">
                    Carlos Rodriguez is on his way to your nearest spot with
                    your basket
                  </p>
                </div>
              </div>

              {/* Delivered */}
              <div className="flex gap-3">
                <div className="flex w-5 justify-center">
                  <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white">
                    <Circle className="h-2 w-2 fill-gray-300 text-gray-300" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-[10px] font-medium text-gray-400">
                      Delivered
                    </p>
                    <span className="text-[8px] text-gray-400">
                      Est. 4:45 PM
                    </span>
                  </div>
                  <p className="mt-0.5 text-[8px] text-gray-400">
                    Securely received and left at your doorstep
                  </p>
                </div>
              </div>
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