"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Package, Plus, X } from "lucide-react";
import {
  BADGES,
  CATEGORIES,
  CTA_OPTIONS,
  createProduct,
  isImageRef,
  updateProduct,
  useProduct,
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
  // For "new" this still loads the store, which createProduct needs.
  const product = useProduct(productId ?? null);

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
            It may have been deleted, or the demo data reset after a refresh.
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
    cta: product?.cta ?? "cart",
    available: product?.available ?? true,
    imageInput: "", // empty = keep the current image (edit) / required (new)
  }));
  const [gallery, setGallery] = useState(() =>
    (product?.gallery ?? []).map((value, i) => ({ key: `seed-${i}`, value }))
  );
  const [galleryInput, setGalleryInput] = useState("");
  const [galleryInputError, setGalleryInputError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Seeded images are static imports; they're kept unless a new path/URL is typed.
  const currentImage = product?.image ?? null;
  const typedImage = values.imageInput.trim();

  const candidate = {
    name: values.name,
    price: values.price.trim(),
    category: values.category,
    stock: values.stock.trim(),
    badge: values.badge,
    cta: values.cta,
    available: values.available,
    image: typedImage || currentImage || "",
    gallery: gallery.map((g) => g.value),
  };
  const allErrors = validateProduct(candidate);
  if (!typedImage && !currentImage) {
    allErrors.image = "Image is required. Enter a path starting with / or a full http(s) URL";
  }
  // Errors appear after the first submit attempt, then update live as you type.
  const errors = submitted ? allErrors : {};

  const previewSrc = typedImage ? (isImageRef(typedImage) ? typedImage : null) : currentImage;

  const setField = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

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
  };

  const removeGalleryImage = (key) => setGallery((g) => g.filter((item) => item.key !== key));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSubmitted(true);

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
      cta: candidate.cta,
      available: candidate.available,
      gallery: candidate.gallery,
    };
    // Only send image when a new one was typed, so edits keep the original.
    if (typedImage) payload.image = typedImage;

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
      toast.error(err?.message || "Could not save product");
      setSaving(false);
    }
  };

  const imageHint = isEdit
    ? "Leave empty to keep the current image. Real uploads come with Convex."
    : "A path starting with / or a full http(s) URL. Real uploads come with Convex.";

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

          <Field id="pf-cta" label="Storefront button" hint="Label on the product card button." error={errors.cta}>
            <select
              id="pf-cta"
              value={values.cta}
              onChange={setField("cta")}
              aria-invalid={Boolean(errors.cta)}
              aria-describedby={describedBy("pf-cta", errors.cta, true)}
              className={inputClass(errors.cta)}
            >
              {CTA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-[16px]">
          {/* Image */}
          <div className="flex flex-col gap-[12px] rounded-[8px] border border-black/5 bg-white p-[20px]">
            <h2 className="text-[18px] font-extrabold text-[#1F2937]">Image</h2>
            <ProductThumb src={previewSrc} alt={values.name || "Product image preview"} className="h-[180px] w-full" />
            <Field id="pf-image" label="Image path or URL" optional={isEdit} hint={imageHint} error={errors.image}>
              <input
                id="pf-image"
                type="text"
                value={values.imageInput}
                onChange={setField("imageInput")}
                placeholder={isEdit ? "Keep current image" : "/images/avocado.png or https://…"}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={describedBy("pf-image", errors.image, true)}
                className={inputClass(errors.image)}
              />
            </Field>
            {isEdit && typedImage && (
              <button
                type="button"
                onClick={() => setValues((v) => ({ ...v, imageInput: "" }))}
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
