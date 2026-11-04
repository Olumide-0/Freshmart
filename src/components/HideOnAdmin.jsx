"use client";

import { usePathname } from "next/navigation";

// Renders nothing on /admin routes so the storefront Navbar/Footer stay out of
// the admin dashboard. Everywhere else it renders its children unchanged.
export default function HideOnAdmin({ children }) {
  const pathname = usePathname() ?? "";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return children;
}
