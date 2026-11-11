// Storefront product data, read from the Express API.
//
// Call getProducts/getProduct from Server Components only: responses are cached
// by Next.js for REVALIDATE_SECONDS, so visitors never wait on the free Render
// API waking up (~50s) once a page has been rendered. The formatting helpers at
// the bottom are pure and safe to import from Client Components.
import { cache } from "react";

const REVALIDATE_SECONDS = 60;
// A cold Render instance takes ~50s to answer; give up a little after that.
const TIMEOUT_MS = 60_000;

function apiUrl(path) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env.local and restart the dev server.");
  }
  return `${base.replace(/\/+$/, "")}${path}`;
}

function apiFetch(path) {
  return fetch(apiUrl(path), {
    next: { revalidate: REVALIDATE_SECONDS },
    // A signal opts out of Next's per-render memoization; cache() below restores it.
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

// filters: { collection, category, occasion, q } (all optional, combined with AND).
// Storefront lists only ever show available products.
// Throws on API errors so a cached page is kept instead of caching an empty list.
export const getProducts = cache(async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  for (const key of ["collection", "category", "occasion", "q"]) {
    const value = filters[key];
    if (value != null && String(value).trim() !== "") params.set(key, String(value).trim());
  }
  params.set("available", "true");

  const res = await apiFetch(`/products?${params}`);
  if (!res.ok) throw new Error(`GET /products failed with ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
});

// Returns the product, or null when the id is unknown or the product is hidden.
export const getProduct = cache(async function getProduct(id) {
  if (!id) return null;
  const res = await apiFetch(`/products/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /products/${id} failed with ${res.status}`);
  const product = await res.json();
  return product?.available === false ? null : product;
});

// ---- Formatting helpers (pure) ----

// 42 -> "42.00", 46.67 -> "46.67"
export function formatPrice(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

// { weight: 1, unit: "kg" } -> "1 kg"; missing values -> ""
export function formatWeight(product) {
  const { weight, unit } = product ?? {};
  if (weight == null && !unit) return "";
  if (weight == null) return unit;
  return unit ? `${weight} ${unit}` : String(weight);
}

// "$42.00/kg" for 1 kg, "$42.00/500 g" for 500 g, "$42.00" with no unit.
export function formatUnitPrice(product) {
  const { weight, unit } = product ?? {};
  const per = !unit ? "" : weight == null || weight === 1 ? unit : formatWeight(product);
  return `$${formatPrice(product?.price)}${per ? `/${per}` : ""}`;
}

// Whole-number percentage off, or null when there is no valid old price.
export function discountPercent(product) {
  const price = Number(product?.price);
  const oldPrice = Number(product?.oldPrice);
  if (!product?.oldPrice || !Number.isFinite(price) || !(oldPrice > price)) return null;
  return Math.round((1 - price / oldPrice) * 100);
}
