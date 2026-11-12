"use client"; // Error boundaries must be Client Components

import ApiErrorState from "@/components/ApiErrorState";

// Shown when the products API is slow or down. The navbar and footer stay.
export default function ProductsError({ error, retry }) {
  return <ApiErrorState error={error} retry={retry} />;
}
