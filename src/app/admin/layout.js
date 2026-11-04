import { notFound } from "next/navigation";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: { default: "Admin | FreshMart", template: "%s | FreshMart Admin" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default async function AdminLayout({ children }) {
  // Wait for a real request so ADMIN_ENABLED is read at request time, not
  // baked in when `next build` prerenders this route.
  await connection();

  // TODO: Temporary switch. Replace with a real login that checks an admin role.
  // That alone is not enough: the real protection must be a server-side admin
  // check inside every function that creates, updates or deletes products
  // (the Convex mutations), because hiding this UI does not secure the data.
  if (process.env.ADMIN_ENABLED !== "true") notFound();

  return <AdminShell>{children}</AdminShell>;
}
