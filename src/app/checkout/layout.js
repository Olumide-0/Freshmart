import RequireAuth from "@/components/auth/RequireAuth";

// Checkout needs a logged-in customer. The gate opens the login modal and shows
// the checkout as soon as the login succeeds. checkout/page.jsx is unchanged.
export default function CheckoutLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
