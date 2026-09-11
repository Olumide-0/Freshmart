import { PRODUCTS } from "@/data/product";

// Case-insensitive substring match on product name.
// Add more datasets here later (e.g. OCCASION_PRODUCTS) if you want search to span them too.
export function searchProducts(query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(term));
}