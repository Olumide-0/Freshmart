"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Trash2,
  Leaf,
  Scale,
  ChevronDown,
  ShoppingBasket,
  Trash,
  Lock,
} from "lucide-react";
import carrot from "../../assets/image/image 113.png";
import cabbage from "../../assets/image/ImageContainer (1).png";
import tomatoes from "../../assets/image/image 110.png";
import avocado from "../../assets/image/image 112.png";
import veggieCrate from "../../assets/image/image 166.png";
import Crate from "../../assets/image/empty Cart image.png";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import AuthFlow from "@/components/auth/AuthFlow";
import CustomQuantityModal from "@/components/cart/CustomQuantityModal";

const RELATED_PRODUCTS = [
  { id: "related-carrot", image: carrot, name: "Carrot", badge: "Off season", price: 42 },
  { id: "related-cabbage", image: cabbage, name: "Cabbage", badge: null, price: 42 },
  { id: "related-tomatoes", image: tomatoes, name: "Tomatoes", badge: "Low in stock", price: 42 },
  { id: "related-avocado-1", image: avocado, name: "Organic Avocado", badge: null, price: 42 },
  { id: "related-avocado-2", image: veggieCrate, name: "Organic Avocado", badge: null, price: 42 },
];

const BADGE_STYLES = {
  "In season": "bg-[#E6F0E1] text-[#3E5730]",
  "Off season": "bg-[#FBE9D9] text-[#C6672E]",
  "Low in stock": "bg-[#FBE9D9] text-[#C6672E]",
  "Low in stock (Buy now)": "bg-[#FBE9D9] text-[#C6672E]",
};

export default function CartPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const setCustomQuantity = useCartStore((s) => s.setCustomQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const [agreed, setAgreed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [customModalFor, setCustomModalFor] = useState(null);

  if (!user) {
    return (
      <div className="flex w-full flex-col items-center justify-center bg-[#F6F0E3] px-[20px] py-[60px] sm:px-[40px] sm:py-[80px] md:px-[64px] xl:px-[10px] xl:py-[180px] text-center">
        <Image src={Crate} alt="" className="h-[188px] w-[209px]"/>
        <h1 className="mt-[16px] text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px]">
          Sign up or log in to view your cart
        </h1>
        <p className="mt-[8px] text-[14px] sm:text-[16px] text-gray-500">
          You need an account to add items and check out.
        </p>
        <button
          onClick={() => setAuthOpen(true)}
          className="mt-[20px] rounded-[8px] bg-[#3E5730] px-[24px] py-[12px] text-[14px] font-semibold text-white sm:rounded-[8px] sm:px-[32px] sm:py-[14px] sm:text-[15px]"
        >
          Sign up / Log in
        </button>
        {authOpen && <AuthFlow onClose={() => setAuthOpen(false)} />}
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.quantity * 6, 0);

  const handleCheckout = () => {
    if (!agreed) return;
    router.push("/checkout");
  };

  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[24px] sm:px-[40px] sm:py-[28px] md:px-[64px] md:py-[32px] xl:px-[200px] xl:py-[50px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-[6px] text-[12px] sm:text-[13px] text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="text-[#C6672E]">&gt;</span>
        <span className="font-semibold text-[#1F2937]">Cart</span>
      </div>

      {/* Header */}
      <div className="mt-[16px] flex flex-wrap items-center justify-between gap-y-[12px]">
        <h1 className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px] lg:text-[26px]">
          Your Cart ({items.length})
        </h1>
        <Link
          href="/"
          className="flex items-center gap-[6px] rounded-[8px] border border-gray-300 bg-white px-[16px] py-[8px] text-[13px] font-semibold text-[#1F2937] sm:px-[18px] sm:py-[10px] sm:text-[14px]"
        >
          <ChevronLeft className="h-[16px] w-[16px]" strokeWidth={2} />
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-[24px] flex flex-col items-center rounded-[8px] bg-white px-[20px] py-[60px] sm:px-[40px] sm:py-[80px] text-center">
          <Image src={Crate} alt="" className="h-[188px] w-[209px]"/>
          <h2 className="mt-[20px] text-[20px] font-extrabold text-[#1F2937] sm:text-[22px]">
            Your cart is empty
          </h2>
          <p className="mt-[8px] text-[14px] sm:text-[15px] text-gray-500">
            Let&rsquo;s get some items in your cart and stock up your groceries!
          </p>
          <Link
            href="/"
            className="mt-[24px] rounded-[8px] bg-[#3E5730] px-[24px] py-[12px] text-[14px] font-semibold text-white sm:px-[32px] sm:py-[14px] sm:text-[15px]"
          >
            Let&rsquo;s go shopping
          </Link>
        </div>
      ) : (
        <div className="mt-[20px] flex flex-col lg:flex-row gap-[20px] lg:gap-[24px] items-start">
          {/* Left column (w-[70%] on lg screens) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-[16px]">
            {/* Free delivery banner */}
            <div className="flex flex-row items-center justify-between rounded-[8px] bg-white p-[16px] sm:p-[20px] gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-[10px]">
                  <p className="text-[16px] sm:text-[15px] text-[#1F2937]">
                    You&rsquo;re <span className="font-bold">MXN 120</span> away from{" "}
                    <span className="font-bold">FREE</span> delivery
                  </p>
                  <span className="text-[16px] font-extrabold text-[#1F2937]">78%</span>
                </div>
                <div className="h-[8px] w-full rounded-[8px] bg-[#E9E4D8] overflow-hidden">
                  <div className="h-[8px] w-[78%] rounded-[8px] bg-[#3E5730]" />
                </div>
              </div>
              <div className="flex items-center justify-center shrink-0">
                <svg
                  width="110"
                  height="60"
                  viewBox="0 0 110 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="object-contain"
                >
                  <ellipse cx="65" cy="54" rx="35" ry="3" fill="#E2DACD" />
                  <rect x="35" y="15" width="55" height="32" rx="4" fill="#3E5730" />
                  <path
                    d="M42 25C44 23 48 23 50 25C48 27 44 27 42 25Z"
                    fill="#5A7A48"
                  />
                  <path
                    d="M45 35C47 33 51 33 53 35C51 37 47 37 45 35Z"
                    fill="#5A7A48"
                  />
                  <text
                    x="62"
                    y="33"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    FreshMart
                  </text>
                  <path d="M90 27L100 35V47H90V27Z" fill="white" />
                  <rect x="90" y="27" width="10" height="20" fill="white" />
                  <path
                    d="M90 27H97C99 27 100 28 100 30V35H90V27Z"
                    fill="#E6F0E1"
                  />
                  <path
                    d="M92 29H97C98 29 98.5 29.5 98.5 30.5V33H92V29Z"
                    fill="#3E5730"
                    fillOpacity="0.8"
                  />
                  <rect x="99" y="37" width="1" height="4" fill="#F79E1B" />
                  <circle cx="50" cy="48" r="6" fill="#2C3E2B" />
                  <circle cx="50" cy="48" r="3" fill="#A3A3A3" />
                  <circle cx="90" cy="48" r="6" fill="#2C3E2B" />
                  <circle cx="90" cy="48" r="3" fill="#A3A3A3" />
                </svg>
              </div>
            </div>

            {/* Cart item cards */}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row overflow-hidden rounded-[8px] bg-white"
              >
                {/* Product image bleeds flush to the card edges (top/left/bottom) */}
                <div className="relative h-[220px] sm:h-auto w-full sm:w-[260px] md:w-[300px] shrink-0 self-stretch overflow-hidden rounded-[8px] sm:rounded-r-none">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 p-[16px] sm:p-[20px]">
                  <div className="flex items-start justify-between gap-[12px]">
                    <div className="flex flex-wrap items-center gap-[10px]">
                      <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1F2937]">{item.name}</h3>
                      {item.badge && (
                        <span
                          className={`rounded-[8px] px-[10px] py-[3px] text-[11px] font-semibold ${
                            BADGE_STYLES[item.badge] || "bg-[#FBE9D9] text-[#C6672E]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Price block: big price, small MXN superscript, unit price + weight below */}
                    <div className="text-right shrink-0">
                      <div className="flex items-start justify-end gap-[3px]">
                        <span className="text-[24px] sm:text-[26px] font-extrabold leading-none text-[#1F2937]">
                          ${item.price}
                        </span>
                        <sup className="mt-[2px] text-[11px] sm:text-[12px] font-semibold text-[#4B5563]">
                          MXN
                        </sup>
                      </div>
                      <p className="mt-[10px] text-[14px] sm:text-[15px] text-[#4B5563]">
                        {item.unitPrice || "$19.00/kg"}
                      </p>
                      <p className="mt-[4px] text-[14px] sm:text-[15px] text-[#4B5563]">
                        ({item.weight || "1kg"})
                      </p>
                    </div>
                  </div>

                  <p className="mt-[6px] max-w-[420px] text-[16px] leading-[1.5] text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-[8px] flex items-center gap-[6px]">
                    <div className="flex text-[#E3A008]">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-[13px] w-[13px]"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="text-[16px] text-gray-500">
                      {item.rating || "4.9"} ({item.reviews || "312 reviews"})
                    </span>
                  </div>

                  <div className="mt-[12px] flex flex-wrap items-end justify-between gap-4">
                    <div>
                      {/* Unified bordered pill-group for size selection */}
                      <div className="flex items-center gap-[6px] rounded-[10px] border border-[#F0DFC0] bg-[#FBF8F2] p-[6px]">
                        {item.sizes.map((size) =>
                          size === "Custom" ? (
                            <button
                              key={size}
                              onClick={() => setCustomModalFor(item.id)}
                              className="flex flex-1 items-center justify-between gap-[6px] whitespace-nowrap px-[14px] py-[8px] text-[14px] font-semibold text-[#1F2937]"
                            >
                              {size}
                              <ChevronDown className="h-[16px] w-[16px]" strokeWidth={2} />
                            </button>
                          ) : (
                            <button
                              key={size}
                              className={`rounded-[8px] px-[14px] py-[8px] text-[13px] font-semibold ${
                                item.selectedSize === size
                                  ? "bg-[#3E5730] text-white"
                                  : "bg-[#F6F0E4] text-[#1F2937]"
                              }`}
                            >
                              {size}
                            </button>
                          )
                        )}
                      </div>

                      {/* Unified bordered container for quantity stepper */}
                      <div className="mt-[10px] flex w-fit items-center gap-[14px] rounded-[8px] border border-[#F0DFC0] bg-white px-[12px] py-[7px]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[16px] font-medium leading-none text-[#1F2937]"
                        >
                          −
                        </button>
                        <span className="w-[16px] text-center text-[14px] font-bold text-[#1F2937]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[16px] font-medium leading-none text-[#1F2937]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-[16px]">
                      <button aria-label="Save for later">
                        <Heart className="h-[18px] w-[18px] text-[#1F2937]" strokeWidth={1.75} />
                      </button>
                      <button aria-label="Remove item" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-[18px] w-[18px] text-[#1F2937]" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column: Basket summary (w-[30%] on lg screens) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-[16px] overflow-hidden rounded-[8px] bg-white p-[20px] sm:p-[24px]">
            <h2 className="text-[18px] font-extrabold text-[#1F2937]">Basket summary</h2>

            {/* Image bleeds to the true left edge via negative margin; everything else stays in the shared padding */}
            <div className="relative flex items-center justify-between gap-[16px] -ml-[20px] sm:-ml-[24px]">
              <div className="relative h-[180px] w-[100px] sm:w-[110px] shrink-0 overflow-hidden ">
                <Image src={veggieCrate} alt="Basket" fill className="object-cover" />
              </div>

              <div className="flex flex-col gap-[20px] items-center justify-between pr-[4px]">
                <div className="flex">
                    <div className="flex items-center gap-[10px]">
                  <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#E6F0E1]">
                    <Leaf className="h-[15px] w-[15px] text-[#3E5730]" strokeWidth={2} />
                  </span>
                  <span className="text-[13px] leading-tight text-[#1F2937]">
                    <span className="block text-[14px] font-extrabold">48hrs</span>
                    <span className="text-gray-500">Freshness</span>
                  </span>
                </div>

                <div className="flex items-center gap-[10px]">
                  <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#E6F0E1]">
                    <Scale className="h-[15px] w-[15px] text-[#3E5730]" strokeWidth={2} />
                  </span>
                  <span className="text-[13px] leading-tight text-[#1F2937]">
                    <span className="block text-[14px] font-extrabold">{totalWeight} kg</span>
                    <span className="text-gray-500">Total weight</span>
                  </span>
                </div>
                </div>
                <div className="h-px w-full bg-gray-100" />

            <div className="flex flex-col gap-[10px] text-[14px]">
              <div className="flex items-center justify-between gap-10">
                <span className="text-gray-500 text-[16px]">Subtotal</span>
                <span className="font-semibold text-[#1F2937]">
                  ${subtotal}
                  <sup className="text-[10px]">MXN</sup>
                </span>
              </div>
              <div className="flex items-center justify-between gap-10">
                <span className="text-gray-500 text-[16px]">Delivery</span>
                <span className="text-gray-500 text-[16px]">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between gap-10">
                <span className="text-gray-500 text-[16px]">Taxes</span>
                <span className="text-gray-500 text-[16px]">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-10 border-t border-gray-100 pt-[16px]">
              <span className="text-[15px] font-bold text-[#1F2937]">Estimated Total</span>
              <span className="text-[20px] font-extrabold text-[#1F2937]">
                ${subtotal}
                <sup className="text-[11px]">MXN</sup>
              </span>
            </div>
              </div>
            </div>

            

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
                    <ShoppingBasket className="h-[16px] w-[16px]" strokeWidth={2} />
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

            <label className="flex items-center gap-[8px] text-[16px] text-[#1F2937] cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-[16px] w-[16px] rounded-[4px] accent-[#3E5730]"
              />
              I agree to{" "}
              <span className="font-semibold underline">freshmart&rsquo;s return policy</span>
            </label>

            <button
              onClick={handleCheckout}
              disabled={!agreed}
              className={`w-full rounded-[8px] py-[12px] text-[16px] font-semibold text-white sm:py-[14px] sm:text-[15px] ${
                agreed ? "bg-[#3E5730]" : "cursor-not-allowed bg-[#B9C6B0]"
              }`}
            >
              Go to checkout
            </button>

            {/* Secure Payment Block */}
            <div className="rounded-[8px] bg-[#F6F0E3] p-[16px]">
              <div className="flex items-center gap-[6px] text-[13px] font-semibold text-[#1F2937]">
                <Lock className="h-[14px] w-[14px]" strokeWidth={2} />
                Secure payment
              </div>
              <div className="mt-[10px] flex justify-between flex-wrap items-center gap-[8px]">
                <div className="flex items-center bg-white px-[8px] py-[4px] rounded-[6px] shadow-sm">
                  <span className="text-[16px] font-extrabold tracking-tighter text-[#1434CB] italic">VISA</span>
                </div>
                <div className="flex items-center gap-[2px] bg-white px-[8px] py-[4px] rounded-[6px] shadow-sm">
                  <span className="text-[16px] font-bold text-[#5F6368]">G</span>
                  <span className="text-[16px] font-medium text-[#5F6368]">Pay</span>
                </div>
                <div className="flex items-center bg-white px-[6px] py-[4px] rounded-[6px] shadow-sm">
                  <div className="flex -space-x-[6px]">
                    <div className="w-[16px] h-[16px] rounded-full bg-[#EB001B]" />
                    <div className="w-[16px] h-[16px] rounded-full bg-[#F79E1B] opacity-80" />
                  </div>
                  <span className="text-[16px] font-bold tracking-tighter text-[#222] ml-[4px]">mastercard</span>
                </div>
                <div className="flex items-center gap-[2px] bg-white px-[8px] py-[4px] rounded-[6px] shadow-sm">
                  <span className="text-[16px] font-bold text-black">Pay</span>
                </div>
              </div>
            </div>

            <div className="rounded-[8px] bg-[#E6F0E1] p-[16px]">
              <p className="text-[16px] font-semibold text-[#3E5730]">Earliest delivery</p>
              <p className="mt-[4px] text-[16px] font-extrabold text-[#1F2937]">Today</p>
              <p className="text-[16px] text-[#1F2937]">2:00PM-4:00PM</p>
              <button className="mt-[8px] flex items-center gap-[4px] text-[16px] font-semibold text-[#3E5730]">
                Change delivery time
                <ChevronRight className="h-[13px] w-[13px]" strokeWidth={2} />
              </button>
            </div>

            <div className="rounded-[8px] bg-[#E6F0E1] p-[16px]">
              <p className="text-[16px] font-semibold text-[#3E5730]">Picked within the last 24hrs</p>
              <p className="mt-[4px] text-[16px] font-extrabold text-[#1F2937]">
                100% freshness guaranteed
              </p>
              <button className="mt-[8px] flex items-center gap-[4px] text-[16px] font-semibold text-[#3E5730]">
                Learn more
                <ChevronRight className="h-[13px] w-[13px]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* You may also like */}
      <div className="mt-[32px] sm:mt-[40px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-[#1F2937] sm:text-[22px]">You may also like</h2>
          <Link href="#" className="flex items-center gap-[6px] text-[14px] sm:text-[15px] font-semibold text-[#3E5730]">
            View All
            <ChevronRight className="h-[16px] w-[16px]" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-[16px] sm:mt-[20px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[12px] sm:gap-[20px]">
          {RELATED_PRODUCTS.map((product) => (
            <div key={product.id} className="flex flex-col overflow-hidden rounded-[8px] bg-white">
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />
                {product.badge && (
                  <span
                    className={`absolute bottom-[12px] left-[12px] rounded-[8px] px-[10px] py-[3px] sm:px-[12px] sm:py-[4px] text-[11px] sm:text-[12px] font-semibold ${
                      BADGE_STYLES[product.badge] || "bg-[#FBE9D9] text-[#C6672E]"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-[12px] sm:p-[16px]">
                <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1F2937]">{product.name}</h3>
                <p className="mt-[2px] text-[12px] sm:text-[13px] text-gray-500">1g</p>
                <div className="mt-[6px] flex items-center gap-[6px]">
                  <div className="flex text-[#E3A008]">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-[13px] w-[13px]"
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="text-[12px] sm:text-[13px] text-gray-500">4.9 (312)</span>
                </div>
                <div className="mt-[8px] flex items-baseline gap-[6px]">
                  <span className="text-[18px] sm:text-[20px] font-extrabold text-[#1F2937]">${product.price}</span>
                  <sup className="text-[10px] font-semibold text-[#1F2937]">MXN</sup>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="mt-[12px] sm:mt-[14px] w-full rounded-[8px] bg-[#3E5730] py-[10px] text-[13px] sm:text-[14px] font-semibold text-white"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {customModalFor && (
        <CustomQuantityModal
          onClose={() => setCustomModalFor(null)}
          onConfirm={(amount, unit) => setCustomQuantity(customModalFor, amount, unit)}
        />
      )}
    </div>
  );
}