"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Mic, Search } from "lucide-react";
import { logout } from "@/lib/auth";
import { LOW_STOCK_THRESHOLD, useProducts, useProductsError } from "@/lib/admin/productsData";
import { useAuthStore } from "@/store/useAuthStore";
import ProductThumb from "@/components/admin/ProductThumb";
import DatePicker from "@/components/admin/overview/DatePicker";
import { useDismiss } from "@/components/admin/overview/parts";

const noopSubscribe = () => () => {};

// Search goes to the products table filtered by name (/admin/products?q=...).
function SearchPill() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const voiceSupported = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    () => false
  );

  const go = (text) => {
    const q = text.trim();
    router.push(q ? `/admin/products?q=${encodeURIComponent(q)}` : "/admin/products");
  };

  // One-shot English voice search: fills the box, then searches.
  const startVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || listening) return;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    let heard = "";
    recognition.onresult = (e) => {
      heard = e.results[0]?.[0]?.transcript ?? "";
      setQuery(heard);
    };
    recognition.onend = () => {
      setListening(false);
      if (heard.trim()) go(heard);
    };
    recognition.onerror = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(query);
      }}
      className="flex h-[40px] w-full items-center rounded-full border border-gray-200 bg-white pl-[16px] lg:max-w-[420px]"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={listening ? "Listening…" : "Search products"}
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1F2937] outline-none placeholder:text-gray-400"
      />
      {voiceSupported && (
        <button
          type="button"
          onClick={startVoice}
          aria-label={listening ? "Listening" : "Search by voice"}
          className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full ${
            listening ? "text-[#C6672E]" : "text-gray-500 hover:text-[#1F2937]"
          }`}
        >
          <Mic className="h-[16px] w-[16px]" strokeWidth={2} />
        </button>
      )}
      <button
        type="submit"
        aria-label="Search"
        className="ml-[6px] flex h-[40px] w-[48px] shrink-0 items-center justify-center rounded-r-full rounded-l-[10px] bg-[#2F5D3A] text-white hover:bg-[#3E5730]"
      >
        <Search className="h-[16px] w-[16px]" strokeWidth={2.25} />
      </button>
    </form>
  );
}

// Bell: number of low and out-of-stock products (real data), with a short list.
// alerts: undefined while loading; error: load error message, if any.
function StockBell({ alerts, error }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);
  const count = alerts?.length ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={count ? `${count} stock alerts` : "No stock alerts"}
        className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-gray-200 bg-white text-[#1F2937] hover:bg-gray-50"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
        {count > 0 && (
          <span className="absolute -right-[4px] -top-[4px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E07B2A] px-[4px] text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[280px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[12px] border border-black/5 bg-white shadow-lg">
          <p className="border-b border-black/5 px-[14px] py-[10px] text-[13px] font-bold text-[#1F2937]">Stock alerts</p>
          {error ? (
            <p className="px-[14px] py-[16px] text-[13px] text-gray-500">Couldn’t load stock. {error}</p>
          ) : alerts === undefined ? (
            <p className="px-[14px] py-[16px] text-[13px] text-gray-500">Loading…</p>
          ) : count === 0 ? (
            <p className="px-[14px] py-[16px] text-[13px] text-gray-500">Everything is well stocked.</p>
          ) : (
            <ul className="max-h-[280px] divide-y divide-black/5 overflow-y-auto">
              {alerts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${encodeURIComponent(p.id)}/edit`}
                    className="flex items-center gap-[10px] px-[14px] py-[10px] hover:bg-gray-50"
                  >
                    <ProductThumb src={p.image} alt="" className="h-[32px] w-[32px]" />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1F2937]">{p.name}</span>
                    <span className="shrink-0 text-[12px] font-semibold text-red-600">
                      {p.stock <= 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function UserMenu({ name, contact }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Account menu for ${name}`}
        className="flex items-center gap-[8px] rounded-full py-[2px] pl-[2px] pr-[4px] hover:bg-black/5"
      >
        <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#2F5D3A] text-[14px] font-bold uppercase text-white">
          {name.charAt(0) || "A"}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[140px] truncate text-[13px] font-bold text-[#1F2937]">{name}</span>
          <span className="block text-[11px] text-gray-500">Admin</span>
        </span>
        <ChevronDown className="h-[16px] w-[16px] text-gray-500" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[240px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[12px] border border-black/5 bg-white py-[6px] shadow-lg">
          <p className="truncate px-[14px] py-[8px] text-[12px] text-gray-500" title={contact}>
            Signed in as <span className="font-semibold text-[#1F2937]">{contact}</span>
          </p>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-[8px] px-[14px] py-[10px] text-[13px] font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-[16px] w-[16px]" strokeWidth={2} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

// Users have no name in the API yet: use the part of the email before "@",
// or the phone number for phone-only accounts.
export function displayName(user) {
  if (user?.email) return user.email.split("@")[0];
  return user?.phone || "Admin";
}

// Admin header contents, shown on every admin page by AdminShell.
// Stock alerts are REAL: products with stock <= LOW_STOCK_THRESHOLD.
export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const products = useProducts();
  const loadError = useProductsError();

  const alerts = useMemo(
    () =>
      products
        ?.filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name)),
    [products]
  );

  const name = displayName(user);
  const contact = user?.email || user?.phone || "";

  return (
    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:justify-between">
      <SearchPill />
      <div className="flex items-center justify-between gap-[12px] lg:justify-end">
        <DatePicker />
        <div className="flex items-center gap-[12px]">
          <StockBell alerts={alerts} error={products === undefined ? loadError : null} />
          <UserMenu name={name} contact={contact} />
        </div>
      </div>
    </div>
  );
}
