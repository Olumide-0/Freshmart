// Admin product data, backed by the Express API through src/lib/api.js.
// The hooks keep a small zustand cache so the admin screens share one list.
// SECURITY TODO: ADMIN_ENABLED only hides the admin UI. These requests go
// straight from the browser to the API, so the Express API itself must check
// for an authenticated admin on POST, PATCH and DELETE /products.

import { useEffect } from "react";
import { create } from "zustand";
import api from "@/lib/api";
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

// --- Validation (client-side help for the form; the API is the real check) --
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

  // Image is optional: empty means "use the placeholder". Only check the format when set.
  const image = typeof data.image === "string" ? data.image.trim() : data.image;
  if (image && !isImageRef(image))
    errors.image = "Enter an image path starting with / or a full http(s) URL";

  if ((data.gallery ?? []).some((g) => !isImageRef(g)))
    errors.gallery = "Each gallery image must be a path starting with / or an http(s) URL";

  return errors;
}

// --- API errors ----------------------------------------------------------
const API_FIELDS = ["name", "price", "category", "stock", "image", "gallery", "badge", "cta", "available"];

// One readable message from an axios error: 400 { errors: [...] } or { error }.
export function getApiErrorMessage(error) {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map(String).join(". ");
  }
  if (typeof data?.error === "string" && data.error) return data.error;
  if (error?.response) return `The API returned an error (${error.response.status})`;
  // No response: API down, CORS blocked, timeout. Non-axios errors (e.g. the
  // missing NEXT_PUBLIC_API_URL guard in api.js) keep their own message.
  if (!error?.isAxiosError && error?.message) return error.message;
  return "Could not reach the API";
}

// Splits a 400's errors[] into { fieldErrors: { price: "Price must be..." }, otherErrors: [...] }.
// Each API message starts with the field name, e.g. "price must be a number, 0 or more".
function getApiFieldErrors(error) {
  const list = error?.response?.status === 400 ? error.response.data?.errors : null;
  const fieldErrors = {};
  const otherErrors = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const message = String(raw);
    const field = API_FIELDS.find((f) => message === f || message.startsWith(`${f} `));
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = message.charAt(0).toUpperCase() + message.slice(1);
    } else {
      otherErrors.push(message);
    }
  }
  return { fieldErrors, otherErrors };
}

// What the mutations throw: err.message works with the existing toasts, and
// err.fieldErrors / err.otherErrors let the form show 400s inline.
function toApiError(error) {
  const err = new Error(getApiErrorMessage(error));
  const { fieldErrors, otherErrors } = getApiFieldErrors(error);
  err.status = error?.response?.status ?? null;
  err.fieldErrors = fieldErrors;
  err.otherErrors = otherErrors;
  err.cause = error;
  return err;
}

// --- Mapping between the API and the screens -------------------------------
function toImageString(value) {
  if (value && typeof value === "object") return value.src ?? "";
  return String(value ?? "").trim();
}

// The screens sort with `b.createdAt - a.createdAt`, so ISO strings become
// millisecond numbers here (same shape the screens already use).
function fromApi(p) {
  return {
    id: p.id,
    name: p.name ?? "",
    price: Number(p.price),
    category: p.category ?? "",
    stock: Number(p.stock),
    image: p.image ?? "",
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    badge: p.badge || null,
    cta: p.cta || "cart",
    available: p.available ?? true,
    createdAt: Date.parse(p.createdAt) || 0,
    updatedAt: Date.parse(p.updatedAt) || 0,
  };
}

// Builds the request body from whichever fields are present. Never sends id,
// createdAt or updatedAt: the API owns those.
function toApiBody(data) {
  const body = {};
  if ("name" in data) body.name = String(data.name ?? "").trim();
  if ("price" in data) body.price = Number(data.price);
  if ("category" in data) body.category = data.category;
  if ("stock" in data) body.stock = Number(data.stock);
  if ("image" in data) body.image = toImageString(data.image);
  if ("gallery" in data) body.gallery = (data.gallery ?? []).map(toImageString);
  if ("badge" in data) body.badge = data.badge ? String(data.badge) : "";
  if ("cta" in data) body.cta = String(data.cta ?? "");
  if ("available" in data) body.available = Boolean(data.available);
  return body;
}

// --- Cache -------------------------------------------------------------------
const useAdminProductsStore = create(() => ({
  products: undefined, // undefined = not loaded yet
  error: null, // list load error message
  detail: { id: null, product: undefined, error: null }, // the product open in the form
}));

const setState = useAdminProductsStore.setState;
const getState = useAdminProductsStore.getState;

let listRequest = null;
let mutationCount = 0; // a list response that started before a mutation is stale

function loadProducts() {
  if (listRequest) return listRequest;
  const startedAt = mutationCount;
  listRequest = api
    .get("/products")
    .then((res) => {
      if (startedAt !== mutationCount) return;
      setState({ products: (Array.isArray(res.data) ? res.data : []).map(fromApi), error: null });
    })
    .catch((err) => {
      // Keep showing an already-loaded list if a background refresh fails.
      if (getState().products === undefined) setState({ error: getApiErrorMessage(err) });
    })
    .finally(() => {
      listRequest = null;
    });
  return listRequest;
}

function loadProduct(id) {
  setState({ detail: { id, product: undefined, error: null } });
  api
    .get(`/products/${encodeURIComponent(id)}`)
    .then((res) => {
      if (getState().detail.id !== id) return;
      setState({ detail: { id, product: fromApi(res.data), error: null } });
    })
    .catch((err) => {
      if (getState().detail.id !== id) return;
      if (err?.response?.status === 404) {
        setState({ detail: { id, product: null, error: null } });
      } else {
        setState({ detail: { id, product: undefined, error: getApiErrorMessage(err) } });
      }
    });
}

// --- Public API: screens import only from this file ----------------------

// undefined while loading (or if loading failed), then an array.
// Refreshes from the API each time a screen using it mounts.
export function useProducts() {
  const products = useAdminProductsStore((s) => s.products);
  useEffect(() => {
    if (getState().error) return; // wait for reloadProducts() (Retry)
    loadProducts();
  }, []);
  return products;
}

// Error message if the list could not be loaded, otherwise null.
export function useProductsError() {
  return useAdminProductsStore((s) => s.error);
}

// Clears the list error and fetches again (for a Retry button).
export function reloadProducts() {
  setState({ products: undefined, error: null });
  return loadProducts();
}

// undefined while loading (or if loading failed), null if not found (404),
// otherwise the product. With no id (the "new" form) it returns null.
export function useProduct(id) {
  const detail = useAdminProductsStore((s) => s.detail);
  useEffect(() => {
    if (id) loadProduct(id);
  }, [id]);
  if (!id) return null;
  return detail.id === id ? detail.product : undefined;
}

// Error message if that product could not be loaded (not a 404), otherwise null.
export function useProductError(id) {
  return useAdminProductsStore((s) => (id && s.detail.id === id ? s.detail.error : null));
}

// Fetches that product again (for a Retry button).
export function reloadProduct(id) {
  if (id) loadProduct(id);
}

export async function createProduct(data) {
  let product;
  try {
    const res = await api.post("/products", toApiBody(data));
    product = fromApi(res.data);
  } catch (err) {
    throw toApiError(err);
  }
  mutationCount += 1;
  setState((s) => ({ products: s.products ? [product, ...s.products] : s.products }));
  return product.id;
}

// Partial update: only the fields present in `data` are sent.
export async function updateProduct(id, data) {
  let product;
  try {
    const res = await api.patch(`/products/${encodeURIComponent(id)}`, toApiBody(data));
    product = fromApi(res.data);
  } catch (err) {
    throw toApiError(err);
  }
  mutationCount += 1;
  setState((s) => ({
    products: s.products?.map((p) => (p.id === id ? product : p)),
    detail: s.detail.id === id ? { id, product, error: null } : s.detail,
  }));
  return product.id;
}

export async function removeProduct(id) {
  try {
    await api.delete(`/products/${encodeURIComponent(id)}`);
  } catch (err) {
    const apiError = toApiError(err);
    // Already gone on the server: drop it from the cache too, then report it.
    if (apiError.status === 404) {
      mutationCount += 1;
      setState((s) => ({ products: s.products?.filter((p) => p.id !== id) }));
    }
    throw apiError;
  }
  mutationCount += 1;
  setState((s) => ({ products: s.products?.filter((p) => p.id !== id) }));
  return id;
}
