import { notFound } from "next/navigation";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import RequireAdmin from "@/components/admin/RequireAdmin";

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

  // Kill switch: unless ADMIN_ENABLED is "true", /admin is a 404 for everyone.
  if (process.env.ADMIN_ENABLED !== "true") notFound();

  // Role gate (client): only a logged-in user whose role "admin" is confirmed by
  // GET /auth/me sees the shell; others get the login modal or "Admins only".
  // This only hides UI. The real protection is the Express API, which checks
  // role === "admin" on POST, PATCH and DELETE /products (401/403).
  return (
    <RequireAdmin>
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}
