"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBasket } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Crate from "../../assets/image/empty Cart image.png";

export default function CartPanel({ onClose }) {
  const items = useCartStore((s) => s.items);

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-[620px] w-full max-w-[500px] overflow-y-auto rounded-[12px] bg-white shadow-2xl">
        <div className="flex items-center justify-between px-[28px] py-[24px]">
          <h2 className="text-[22px] font-extrabold text-[#1F2937]">Cart</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-[24px] w-[24px] text-[#1F2937]" strokeWidth={2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center px-[28px] pb-[40px] pt-[10px] text-center">
            <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full bg-[#F6F0E3]">
              <Image src={Crate} alt="" className="h-[188px] w-[209px]"/>
            </div>
            <h3 className="mt-[24px] text-[20px] font-extrabold text-[#1F2937]">
              Your cart is empty
            </h3>
            <p className="mt-[10px] text-[14px] text-gray-500">
              Let&rsquo;s get some items in your cart and stock up your groceries!
            </p>
            <Link
              href="/"
              onClick={onClose}
              className="mt-[28px] w-full rounded-[10px] bg-[#3E5730] py-[14px] text-center text-[15px] font-semibold text-white"
            >
              Let&rsquo;s go shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-[16px] px-[28px] pb-[28px]">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-[14px] border-b border-gray-100 pb-[16px]"
              >
                <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[10px]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-[#1F2937]">{item.name}</p>
                  <p className="text-[13px] text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-[15px] font-extrabold text-[#1F2937]">${item.price}</span>
              </div>
            ))}
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-[8px] w-full rounded-[10px] bg-[#3E5730] py-[14px] text-center text-[15px] font-semibold text-white"
            >
              Go to cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}