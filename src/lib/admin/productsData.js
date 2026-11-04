// TEMPORARY: replace with Convex.
// This is an in-memory zustand store seeded from src/data/product.js. It resets on
// every page refresh, and the storefront never sees these changes. When Convex
// lands, swap the hooks for useQuery and the mutations for useMutation, and keep
// these export names so the admin screens don't change.
// The real protection must be a server-side admin check inside every Convex
// function that changes products; validateProduct() below only helps the UI.

import { useEffect } from "react";
import { create } from "zustand";
import { PRODUCTS } from "@/data/product";
import { CATEGORY_LABELS } from "@/lib/categories";

export const LOW_STOCK_THRESHOLD = 10;

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const BADGES = ["In season", "Low in stock", "Off season"];

export const CTA_OPTIONS = [
  { value: "cart", label: "Add to cart" },
  { value: "add", label: "Add" },
];

export const STOCK_STATUSES = [
  { value: "in", label: "In stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

export function getStockStatus(product) {
  if (product.stock <= 0) return "out";
  if (product.stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function getCategoryLabel(value) {
  return CATEGORY_LABELS[value] ?? value;
}

// --- Seed ---------------------------------------------------------------
// stock and available don't exist in src/data. These numbers are invented demo
// values: 5 for items with the "Low in stock" badge, 24 for everything else,
// and every item available.
function seedProducts() {
  return PRODUCTS.map((p, i) => ({
    id: p.slug,
    name: p.name,
    price: Number(p.price),
    category: p.category,
    image: p.image, // static import object; kept as-is unless replaced in the form
    gallery: p.gallery ?? [],
    badge: p.badge ?? null,
    cta: p.cta ?? "cart",
    stock: p.badge === "Low in stock" ? 5 : 24,
    available: true,
    createdAt: i, // seed order; new products get Date.now() so they sort as newest
  }));
}

const useAdminProductsStore = create(() => ({ products: undefined }));

let loadStarted = false;

// Simulates the async first load a Convex query would have.
function ensureLoaded() {
  if (loadStarted) return;
  loadStarted = true;
  setTimeout(() => {
    useAdminProductsStore.setState({ products: seedProducts() });
  }, 300);
}

// --- Validation (shared by the form and the mutations) -------------------
export function isImageRef(value) {
  if (value && typeof value === "object" && value.src) return true; // static import
  if (typeof value !== "string") return false;
  const v = value.trim();
  return v.startsWith("/") || /^https?:\/\/\S+$/i.test(v);
}

// Returns { field: message }. An empty object means the data is valid.
export function validateProduct(data) {
  const errors = {};
  const name = String(data.name ?? "").trim();
  if (!name) errors.name = "Product name is required";
  else if (name.length > 80) errors.name = "Name must be 80 characters or fewer";

  const price = Number(data.price);
  if (data.price === "" || data.price === null || data.price === undefined)
    errors.price = "Price is required";
  else if (!Number.isFinite(price) || price < 0)
    errors.price = "Enter a valid price (0 or more)";

  const stock = Number(data.stock);
  if (data.stock === "" || data.stock === null || data.stock === undefined)
    errors.stock = "Stock is required";
  else if (!Number.isInteger(stock) || stock < 0)
    errors.stock = "Stock must be a whole number (0 or more)";

  if (!CATEGORY_LABELS[data.category]) errors.category = "Choose a category";
  if (data.badge && !BADGES.includes(data.badge)) errors.badge = "Choose a valid badge";
  if (!CTA_OPTIONS.some((o) => o.value === data.cta)) errors.cta = "Choose a button type";

  if (!isImageRef(data.image))
    errors.image = "Enter an image path starting with / or a full http(s) URL";

  if ((data.gallery ?? []).some((g) => !isImageRef(g)))
    errors.gallery = "Each gallery image must be a path starting with / or an http(s) URL";

  return errors;
}

function normalize(data) {
  return {
    name: String(data.name).trim(),
    price: Number(data.price),
    category: data.category,
    image: typeof data.image === "string" ? data.image.trim() : data.image,
    gallery: (data.gallery ?? []).map((g) => (typeof g === "string" ? g.trim() : g)),
    badge: data.badge || null,
    cta: data.cta,
    stock: Number(data.stock),
    available: Boolean(data.available),
  };
}

function wait(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLoadedProducts() {
  const { products } = useAdminProductsStore.getState();
  if (!products) throw new Error("Products are still loading. Try again in a moment.");
  return products;
}

function assertValid(data) {
  const errors = validateProduct(data);
  const first = Object.values(errors)[0];
  if (first) throw new Error(first);
}

// Builds "<slug>-<timestamp>" and, if that id is already taken in the store,
// appends -2, -3, ... until it is unique.
function makeId(name, products) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const base = `${slug || "product"}-${Date.now().toString(36)}`;
  const taken = new Set(products.map((p) => p.id));
  let id = base;
  let suffix = 2;
  while (taken.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

// --- Public API: screens import only from this file ----------------------

// undefined while loading, then an array.
export function useProducts() {
  const products = useAdminProductsStore((s) => s.products);
  useEffect(() => {
    ensureLoaded();
  }, []);
  return products;
}

// undefined while loading, null if not found, otherwise the product.
export function useProduct(id) {
  const products = useProducts();
  if (products === undefined) return undefined;
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(data) {
  await wait();
  const products = getLoadedProducts();
  assertValid(data);
  const clean = normalize(data);
  const product = { ...clean, id: makeId(clean.name, products), createdAt: Date.now() };
  useAdminProductsStore.setState({ products: [product, ...products] });
  return product.id;
}

// Partial update: fields left out of `data` (e.g. image) keep their current value.
export async function updateProduct(id, data) {
  await wait();
  const products = getLoadedProducts();
  const existing = products.find((p) => p.id === id);
  if (!existing) throw new Error("Product not found. It may have been deleted.");
  const merged = { ...existing, ...data };
  assertValid(merged);
  const updated = { ...existing, ...normalize(merged) };
  useAdminProductsStore.setState({
    products: products.map((p) => (p.id === id ? updated : p)),
  });
  return id;
}

export async function removeProduct(id) {
  await wait();
  const products = getLoadedProducts();
  if (!products.some((p) => p.id === id)) {
    throw new Error("Product not found. It may have already been deleted.");
  }
  useAdminProductsStore.setState({ products: products.filter((p) => p.id !== id) });
  return id;
}
