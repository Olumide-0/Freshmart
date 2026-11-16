import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/admin/productsData";

// Signed product image uploads.
// 1. POST /uploads/signature on our API (admin token, like product writes)
//    returns { cloudName, apiKey, timestamp, folder, allowedFormats, signature }.
// 2. The file goes straight from the browser to Cloudinary with exactly those
//    values. No Cloudinary keys or env vars live in the site.

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Only images in our Cloudinary account are allowed by next.config.mjs
// (images.remotePatterns), so only these show on the storefront.
export const CLOUDINARY_IMAGE_PREFIX = "https://res.cloudinary.com/mfhz2rws/";

// A message when the file can't be uploaded, or null when it's fine.
export function checkImageFile(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `“${file.name}” is not a JPG, PNG or WebP image.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `This image is ${mb} MB. The limit is 2 MB.`;
  }
  return null;
}

async function getSignature() {
  let res;
  try {
    res = await api.post("/uploads/signature");
  } catch (err) {
    const status = err?.response?.status;
    if (status === 503) {
      throw new Error("Image uploads aren't set up on the API yet. You can still type an image path or URL.");
    }
    if (status === 401) throw new Error("Your session has expired. Sign in again to upload images.");
    if (status === 403) throw new Error("Only admins can upload images.");
    throw new Error(`Couldn't start the upload: ${getApiErrorMessage(err)}`);
  }
  const sig = res.data;
  if (!sig?.cloudName || !sig?.apiKey || !sig?.signature || sig?.timestamp == null) {
    throw new Error("Couldn't start the upload: unexpected reply from the API.");
  }
  return sig;
}

// Uploads a checked file and returns its https URL on Cloudinary.
// `signal` cancels the upload (e.g. when the form closes).
export async function uploadImage(file, { signal } = {}) {
  const problem = checkImageFile(file);
  if (problem) throw new Error(problem);

  const sig = await getSignature();
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  // Only the values the API signed, exactly as it sent them.
  if (sig.folder != null) form.append("folder", sig.folder);
  if (sig.allowedFormats != null) {
    form.append(
      "allowed_formats",
      Array.isArray(sig.allowedFormats) ? sig.allowedFormats.join(",") : String(sig.allowedFormats)
    );
  }
  form.append("signature", sig.signature);

  // Plain fetch, not the api instance: our Bearer token must not go to Cloudinary.
  let res;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloudName)}/image/upload`, {
      method: "POST",
      body: form,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new Error("Couldn't reach the upload service. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error?.message;
    throw new Error(message ? `Upload failed: ${message}` : `Upload failed (${res.status}).`);
  }
  if (typeof data?.secure_url !== "string" || !data.secure_url.startsWith("https://")) {
    throw new Error("Upload failed: no image URL came back.");
  }
  return data.secure_url;
}
