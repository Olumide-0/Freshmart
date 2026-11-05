"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, CirclePlus, Store, Menu, X } from "lucide-react";
import logo from "@/assets/image/fresh mart logo.png";
import Toaster from "@/components/admin/Toast";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, match: (p) => p === "/admin" },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    match: (p) => p === "/admin/products" || p.endsWith("/edit"),
  },
  {
    href: "/admin/products/new",
    label: "Add product",
    icon: CirclePlus,
    match: (p) => p === "/admin/products/new",
  },
];

function SidebarNav({ pathname, onNavigate }) {
  const user = useAuthStore((s) => s.user);
  return (
    <nav className="flex flex-1 flex-col gap-[4px] px-[12px] py-[16px]">
      {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-[10px] rounded-[8px] px-[12px] py-[10px] text-[14px] font-semibold transition-colors ${
              active ? "bg-[#E6F0E1] text-[#2F5D3A]" : "text-[#1F2937] hover:bg-black/5"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto border-t border-black/5 pt-[12px]">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-[10px] rounded-[8px] px-[12px] py-[10px] text-[14px] font-semibold text-[#C6672E] hover:bg-black/5"
        >
          <Store className="h-[18px] w-[18px]" strokeWidth={2} />
          View storefront
        </Link>

        {/* Signed in as {email} · Log out (RequireAdmin guarantees a user here) */}
        {user && (
          <div className="mt-[8px] flex items-center gap-[6px] border-t border-black/5 px-[12px] pt-[12px] text-[13px]">
            <span className="min-w-0 truncate text-gray-500" title={user.email || user.phone}>
              Signed in as <span className="font-semibold text-[#1F2937]">{user.email || user.phone}</span>
            </span>
            <span aria-hidden="true" className="text-gray-400">·</span>
            <button
              type="button"
              onClick={logout}
              className="shrink-0 font-semibold text-red-600 hover:underline"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-[10px]">
      <Image src={logo} alt="FreshMart" className="h-[40px] w-[59px]" />
      <span className="rounded-full bg-[#E6F0E1] px-[10px] py-[2px] text-[12px] font-semibold text-[#3E5730]">
        Admin
      </span>
    </Link>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div data-admin-shell className="min-h-screen bg-[#F6F0E3] font-sans text-[#1F2937]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-black/5 bg-white lg:flex">
        <div className="flex h-[72px] items-center border-b border-black/5 px-[20px]">
          <Brand />
        </div>
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-[60px] items-center gap-[12px] border-b border-black/5 bg-white px-[16px] lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-[#1F2937] hover:bg-black/5"
        >
          <Menu className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </button>
        <Brand />
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />
          <aside className="relative flex h-full w-[260px] max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-[60px] items-center justify-between border-b border-black/5 px-[16px]">
              <Brand />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] hover:bg-black/5"
              >
                <X className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[240px]">
        <div className="mx-auto w-full max-w-[1200px] px-[16px] py-[24px] sm:px-[24px] lg:px-[40px] lg:py-[32px]">
          {children}
        </div>
      </div>

      <Toaster />
    </div>
  );
}
