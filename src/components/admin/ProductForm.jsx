"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CloudOff, Loader2, Package, Plus, RefreshCw, X } from "lucide-react";
import {
  BADGES,
  CATEGORIES,
  COLLECTIONS,
  OCCASIONS,
  UNITS,
  createProduct,
  isImageRef,
  reloadProduct,
  updateProduct,
  useProduct,
  useProductError,
  validateProduct,
} from "@/lib/admin/productsData";
import ProductThumb from "@/components/admin/ProductThumb";
import { AvailabilitySwitch } from "@/components/admin/ui";
import { toast } from "@/components/admin/Toast";

// Same input look as DeliveryForm, plus a red border when the field has an error.
function inputClass(hasError) {
  return `w-full rounded-[8px] border bg-white p-[12px] text-[14px] text-[#1F2937] outline-none focus:border-[#2F5D3A] ${
    hasError ? "border-red-500" : "border-gray-200"
  }`;
}

function describedBy(id, error, hint) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function Field({ id, label, optional, hint, error, children }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[14px] font-semibold text-[#1F2937]">
        {label}
        {optional && <span className="ml-[4px] font-normal text-gray-500">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] text-gray-500">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// A labelled group of checkboxes (collections, occasions). The first checkbox
// gets the group id so a validation error can focus it.
function CheckboxGroup({ id, legend, hint, options, selected, onToggle, error }) {
  return (
    <fieldset
      className="flex flex-col gap-[6px]"
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
    >
      <legend className="mb-[6px] text-[14px] font-semibold text-[#1F2937]">
        {legend}
        <span className="ml-[4px] font-normal text-gray-500">(optional)</span>
      </legend>
      <div className="grid gap-[8px] sm:grid-cols-2">
        {options.map((o, i) => (
          <label
            key={o.value}
            className={`flex cursor-pointer items-center gap-[8px] rounded-[8px] border bg-white px-[12px] py-[10px] text-[14px] text-[#1F2937] ${
              error ? "border-red-500" : "border-gray-200"
            }`}
          >
            <input
              id={i === 0 ? id : undefined}
              type="checkbox"
              checked={selected.includes(o.value)}
              onChange={() => onToggle(o.value)}
              className="h-[16px] w-[16px] accent-[#2F5D3A]"
            />
            {o.label}
          </label>
        ))}
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] text-gray-500">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">{error}</p>
      )}
    </fieldset>
  );
}

function FormHeader({ isEdit }) {
  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-[6px] text-[14px] font-semibold text-[#2F5D3A] hover:underline"
      >
        <ArrowLeft className="h-[16px] w-[16px]" strokeWidth={2} />
        Back to products
      </Link>
      <h1 className="mt-[8px] text-[22px] font-extrabold text-[#1F2937] sm:text-[26px]">
        {isEdit ? "Edit product" : "Add product"}
      </h1>
    </div>
  );
}

// Handles loading / not-found, then mounts the form once the data is ready, so
// the form's initial state comes straight from the product (no syncing effect).
export default function ProductForm({ productId }) {
  const isEdit = Boolean(productId);
  // undefined while loading, null when not found (or for "new"), else the product.
  const product = useProduct(productId ?? null);
  const loadError = useProductError(productId ?? null);

  if (product === undefined && loadError) {
    return (
      <div>
        <FormHeader isEdit={isEdit} />
        <div role="alert" className="mt-[20px] flex flex-col items-center rounded-[8px] border border-black/5 bg-white px-[16px] py-[48px] text-center">
          <CloudOff className="h-[32px] w-[32px] text-gray-400" strokeWidth={1.75} />
          <p className="mt-[12px] text-[16px] font-bold text-[#1F2937]">Couldn’t load this product</p>
          <p className="mt-[4px] break-words text-[14px] text-gray-500">{loadError}</p>
          <button
            type="button"
            onClick={() => reloadProduct(productId)}
            className="mt-[16px] inline-flex items-center gap-[6px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[8px] text-[14px] font-semibold text-white hover:bg-[#3E5730]"
          >
            <RefreshCw className="h-[16px] w-[16px]" strokeWidth={2} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div>
        <FormHeader isEdit={isEdit} />
        <div className="mt-[20px] animate-pulse space-y-[12px] rounded-[8px] border border-black/5 bg-white p-[24px]" aria-hidden="true">
          <div className="h-[14px] w-1/3 rounded bg-gray-100" />
          <div className="h-[44px] rounded-[8px] bg-gray-100" />
          <div className="h-[44px] rounded-[8px] bg-gray-100" />
          <div className="h-[44px] rounded-[8px] bg-gray-100" />
        </div>
        <p className="sr-only" aria-live="polite">Loading product…</p>
      </div>
    );
  }

  if (isEdit && product === null) {
    return (
      <div>
        <FormHeader isEdit />
        <div className="mt-[20px] flex flex-col items-center rounded-[8px] border border-black/5 bg-white px-[16px] py-[48px] text-center">
          <Package className="h-[32px] w-[32px] text-gray-400" strokeWidth={1.75} />
          <p className="mt-[12px] text-[16px] font-bold text-[#1F2937]">Product not found</p>
          <p className="mt-[4px] text-[14px] text-gray-500">
            It may have been deleted.
          </p>
          <Link
            href="/admin/products"
            className="mt-[16px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[8px] text-[14px] font-semibold text-white hover:bg-[#3E5730]"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return <FormBody key={isEdit ? product.id : "new"} product={isEdit ? product : null} />;
}

function FormBody({ product }) {
  const router = useRouter();
  const isEdit = product !== null;
  const nextGalleryKey = useRef(0);

  const [values, setValues] = useState(() => ({
    name: product?.name ?? "",
    price: product ? String(product.price) : "",
    category: product?.category ?? "",
    stock: product ? String(product.stock) : "",
    badge: product?.badge ?? "",
    oldPrice: product?.oldPrice != null ? String(product.oldPrice) : "",
    weight: product?.weight != null ? String(product.weight) : "",
    unit: product?.unit ?? "",
    collections: product?.collections ?? [],
    occasions: product?.occasions ?? [],
    available: product?.available ?? true,
    imageInput: "", // empty = keep the current image (edit) / placeholder (new)
  }));
  const [gallery, setGallery] = useState(() =>
    (product?.gallery ?? []).map((value, i) => ({ key: `seed-${i}`, value }))
  );
  const [galleryInput, setGalleryInput] = useState("");
  const [galleryInputError, setGalleryInputError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  // Field errors from an API 400, keyed by field; each clears when that field is edited.
  const [apiErrors, setApiErrors] = useState({});

  // The current image is kept unless a new path/URL is typed ("" = placeholder).
  const currentImage = product?.image ?? "";
  const typedImage = values.imageInput.trim();

  const candidate = {
    name: values.name,
    price: values.price.trim(),
    category: values.category,
    stock: values.stock.trim(),
    badge: values.badge,
    oldPrice: values.oldPrice.trim(),
    collections: values.collections,
    occasions: values.occasions,
    weight: values.weight.trim(),
    unit: values.unit,
    available: values.available,
    image: typedImage || currentImage || "",
    gallery: gallery.map((g) => g.value),
  };
  const allErrors = validateProduct(candidate);
  // Client errors appear after the first submit attempt, then update live as you
  // type. API errors fill in for fields the client check didn't flag.
  const errors = { ...apiErrors, ...(submitted ? allErrors : {}) };

  const previewSrc = typedImage ? (isImageRef(typedImage) ? typedImage : null) : currentImage;

  const clearApiError = (field) =>
    setApiErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const setField = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    clearApiError(field === "imageInput" ? "image" : field);
    // The API checks oldPrice against price, so editing either clears both.
    if (field === "price") clearApiError("oldPrice");
  };

  // Adds or removes one value of a checkbox list (collections, occasions).
  const toggleIn = (field) => (value) => {
    setValues((v) => ({
      ...v,
      [field]: v[field].includes(value) ? v[field].filter((x) => x !== value) : [...v[field], value],
    }));
    clearApiError(field);
  };

  const addGalleryImage = () => {
    const value = galleryInput.trim();
    if (!value) {
      setGalleryInputError("Enter a path or URL to add");
      return;
    }
    if (!isImageRef(value)) {
      setGalleryInputError("Use a path starting with / or a full http(s) URL");
      return;
    }
    const key = `added-${nextGalleryKey.current++}`;
    setGallery((g) => [...g, { key, value }]);
    setGalleryInput("");
    setGalleryInputError("");
    clearApiError("gallery");
  };

  const removeGalleryImage = (key) => {
    setGallery((g) => g.filter((item) => item.key !== key));
    clearApiError("gallery");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSubmitted(true);
    setApiErrors({});

    const firstError = Object.keys(allErrors)[0];
    if (firstError) {
      document.getElementById(`pf-${firstError}`)?.focus();
      return;
    }

    const payload = {
      name: candidate.name,
      price: candidate.price,
      category: candidate.category,
      stock: candidate.stock,
      badge: candidate.badge,
      oldPrice: candidate.oldPrice,
      collections: candidate.collections,
      occasions: candidate.occasions,
      weight: candidate.weight,
      unit: candidate.unit,
      available: candidate.available,
      gallery: candidate.gallery,
      // Every field is sent; an edit keeps the current image unless a new one was typed.
      image: typedImage || currentImage,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateProduct(product.id, payload);
        toast.success(`${payload.name.trim()} updated`);
      } else {
        await createProduct(payload);
        toast.success(`${payload.name.trim()} added`);
      }
      router.push("/admin/products"); // keep the button disabled while navigating
    } catch (err) {
      // 400: messages that start with a field name go inline; the rest go to the toast.
      // 409/404 (and network errors) have no field errors, so err.message goes to the toast.
      const fieldErrors = { ...(err?.fieldErrors ?? {}) };
      const toastMessages = [...(err?.otherErrors ?? [])];
      if (fieldErrors.available) {
        // The availability switch has no inline error slot.
        toastMessages.unshift(fieldErrors.available);
        delete fieldErrors.available;
      }
      const fields = Object.keys(fieldErrors);
      setApiErrors(fieldErrors);
      if (fields.length > 0) document.getElementById(`pf-${fields[0]}`)?.focus();
      if (toastMessages.length > 0) toast.error(toastMessages.join(". "));
      else if (fields.length === 0) toast.error(err?.message || "Could not save product");
      setSaving(false);
    }
  };

  const imageHint = isEdit
    ? "Leave empty to keep the current image. Real uploads come later."
    : "A path starting with / or a full http(s) URL. Leave empty to use the placeholder.";

  return (
    <div>
      <FormHeader isEdit={isEdit} />

      <form onSubmit={handleSubmit} noValidate className="mt-[20px] grid gap-[16px] lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Details */}
        <div className="flex flex-col gap-[16px] rounded-[8px] border border-black/5 bg-white p-[20px] sm:p-[24px]">
          <h2 className="text-[18px] font-extrabold text-[#1F2937]">Product details</h2>

          <Field id="pf-name" label="Name" error={errors.name}>
            <input
              id="pf-name"
              type="text"
              value={values.name}
              onChange={setField("name")}
              placeholder="e.g. Organic Avocado"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy("pf-name", errors.name)}
              className={inputClass(errors.name)}
            />
          </Field>

          <div className="grid gap-[16px] sm:grid-cols-2">
            <Field id="pf-price" label="Price (MXN)" error={errors.price}>
              <div className="relative">
                <span className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 text-[14px] font-semibold text-gray-500">
                  $
                </span>
                <input
                  id="pf-price"
                  type="text"
                  inputMode="decimal"
                  value={values.price}
                  onChange={setField("price")}
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={describedBy("pf-price", errors.price)}
                  className={`${inputClass(errors.price)} pl-[26px]`}
                />
              </div>
            </Field>

            <Field id="pf-stock" label="Stock" error={errors.stock}>
              <input
                id="pf-stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={values.stock}
                onChange={setField("stock")}
                placeholder="0"
                aria-invalid={Boolean(errors.stock)}
                aria-describedby={describedBy("pf-stock", errors.stock)}
                className={inputClass(errors.stock)}
              />
            </Field>
          </div>

          <div className="grid gap-[16px] sm:grid-cols-3">
            <Field
              id="pf-oldPrice"
              label="Old price (MXN)"
              optional
              hint="Shown crossed out; must be higher than the price."
              error={errors.oldPrice}
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 text-[14px] font-semibold text-gray-500">
                  $
                </span>
                <input
                  id="pf-oldPrice"
                  type="text"
                  inputMode="decimal"
                  value={values.oldPrice}
                  onChange={setField("oldPrice")}
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.oldPrice)}
                  aria-describedby={describedBy("pf-oldPrice", errors.oldPrice, true)}
                  className={`${inputClass(errors.oldPrice)} pl-[26px]`}
                />
              </div>
            </Field>

            <Field id="pf-weight" label="Weight" optional error={errors.weight}>
              <input
                id="pf-weight"
                type="text"
                inputMode="decimal"
                value={values.weight}
                onChange={setField("weight")}
                placeholder="e.g. 1 or 500"
                aria-invalid={Boolean(errors.weight)}
                aria-describedby={describedBy("pf-weight", errors.weight)}
                className={inputClass(errors.weight)}
              />
            </Field>

            <Field id="pf-unit" label="Unit" optional error={errors.unit}>
              <select
                id="pf-unit"
                value={values.unit}
                onChange={setField("unit")}
                aria-invalid={Boolean(errors.unit)}
                aria-describedby={describedBy("pf-unit", errors.unit)}
                className={inputClass(errors.unit)}
              >
                <option value="">No unit</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-[16px] sm:grid-cols-2">
            <Field id="pf-category" label="Category" error={errors.category}>
              <select
                id="pf-category"
                value={values.category}
                onChange={setField("category")}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={describedBy("pf-category", errors.category)}
                className={inputClass(errors.category)}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field id="pf-badge" label="Badge" optional error={errors.badge}>
              <select
                id="pf-badge"
                value={values.badge}
                onChange={setField("badge")}
                aria-invalid={Boolean(errors.badge)}
                aria-describedby={describedBy("pf-badge", errors.badge)}
                className={inputClass(errors.badge)}
              >
                <option value="">No badge</option>
                {BADGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>

          <CheckboxGroup
            id="pf-collections"
            legend="Collections"
            hint="Storefront sections that list this product."
            options={COLLECTIONS}
            selected={values.collections}
            onToggle={toggleIn("collections")}
            error={errors.collections}
          />

          <CheckboxGroup
            id="pf-occasions"
            legend="Occasions"
            options={OCCASIONS}
            selected={values.occasions}
            onToggle={toggleIn("occasions")}
            error={errors.occasions}
          />
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-[16px]">
          {/* Image */}
          <div className="flex flex-col gap-[12px] rounded-[8px] border border-black/5 bg-white p-[20px]">
            <h2 className="text-[18px] font-extrabold text-[#1F2937]">Image</h2>
            <ProductThumb src={previewSrc} alt={values.name || "Product image preview"} className="h-[180px] w-full" />
            <Field id="pf-image" label="Image path or URL" optional hint={imageHint} error={errors.image}>
              <input
                id="pf-image"
                type="text"
                value={values.imageInput}
                onChange={setField("imageInput")}
                placeholder={isEdit && currentImage ? "Keep current image" : "/images/avocado.png or https://…"}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={describedBy("pf-image", errors.image, true)}
                className={inputClass(errors.image)}
              />
            </Field>
            {isEdit && typedImage && (
              <button
                type="button"
                onClick={() => {
                  setValues((v) => ({ ...v, imageInput: "" }));
                  clearApiError("image");
                }}
                className="self-start text-[13px] font-semibold text-[#2F5D3A] hover:underline"
              >
                Keep current image
              </button>
            )}
          </div>

          {/* Gallery */}
          <div className="flex flex-col gap-[12px] rounded-[8px] border border-black/5 bg-white p-[20px]">
            <h2 className="text-[18px] font-extrabold text-[#1F2937]">
              Gallery <span className="text-[14px] font-normal text-gray-500">(optional)</span>
            </h2>
            {gallery.length > 0 ? (
              <ul className="grid grid-cols-4 gap-[8px]">
                {gallery.map((item, i) => (
                  <li key={item.key} className="relative">
                    <ProductThumb src={item.value} alt={`Gallery image ${i + 1}`} className="aspect-square w-full" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(item.key)}
                      aria-label={`Remove gallery image ${i + 1}`}
                      className="absolute right-[4px] top-[4px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/90 text-[#1F2937] shadow-sm hover:bg-white"
                    >
                      <X className="h-[12px] w-[12px]" strokeWidth={2.5} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-gray-500">No gallery images.</p>
            )}
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="pf-gallery" className="text-[14px] font-semibold text-[#1F2937]">
                Add image path or URL
              </label>
              <div className="flex gap-[8px]">
                <input
                  id="pf-gallery"
                  type="text"
                  value={galleryInput}
                  onChange={(e) => {
                    setGalleryInput(e.target.value);
                    setGalleryInputError("");
                  }}
                  onKeyDown={(e) => {
                    // Enter adds the image instead of submitting the whole form.
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGalleryImage();
                    }
                  }}
                  placeholder="/images/extra.png"
                  aria-invalid={Boolean(galleryInputError || errors.gallery)}
                  aria-describedby={galleryInputError || errors.gallery ? "pf-gallery-error" : undefined}
                  className={`${inputClass(galleryInputError || errors.gallery)} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="flex shrink-0 items-center gap-[4px] rounded-[8px] border border-[#D8DADD] px-[12px] text-[14px] font-semibold text-[#1F2937] hover:bg-black/5"
                >
                  <Plus className="h-[14px] w-[14px]" strokeWidth={2.5} />
                  Add
                </button>
              </div>
              {(galleryInputError || errors.gallery) && (
                <p id="pf-gallery-error" className="text-sm text-red-500">
                  {galleryInputError || errors.gallery}
                </p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between gap-[12px] rounded-[8px] border border-black/5 bg-white p-[20px]">
            <div>
              <p id="pf-available-label" className="text-[14px] font-semibold text-[#1F2937]">Available</p>
              <p className="text-[13px] text-gray-500">
                {values.available ? "Shown as available to sell" : "Marked unavailable"}
              </p>
            </div>
            <AvailabilitySwitch
              checked={values.available}
              onChange={() => setValues((v) => ({ ...v, available: !v.available }))}
              label="Available"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-[10px] sm:flex-row sm:justify-end lg:col-span-2">
          <Link
            href="/admin/products"
            className="flex items-center justify-center rounded-[8px] border border-[#D8DADD] bg-white px-[20px] py-[10px] text-[14px] font-semibold text-[#1F2936] hover:bg-black/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-[8px] rounded-[8px] bg-[#2F5D3A] px-[20px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#3E5730] disabled:opacity-60"
          >
            {saving && <Loader2 className="h-[16px] w-[16px] animate-spin" strokeWidth={2} />}
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}
