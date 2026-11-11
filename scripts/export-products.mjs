// Dev-only export of the storefront's hard-coded product data into one seed for
// the Express API. The Next.js app never imports this file.
//
//   node scripts/export-products.mjs
//       Reads src/data/*.js (plus two small lists copied from components below)
//       and writes ONLY:
//         seed/products.json        the merged, cleaned products (API field names)
//         seed/image-manifest.json  which image file to copy where
//         seed/REVIEW.md            everything hidden, flagged or proposed
//
//   node scripts/export-products.mjs --copy-images
//       Converts the files listed in seed/image-manifest.json to WebP in public/products/
//       (resized, never upscaled). Uses sharp, which comes with Next.js.
//       Never overwrites or deletes; run only after REVIEW.md is approved.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEED_DIR = join(ROOT, "seed");
const ASSET_DIR = "src/assets/image";
const PUBLIC_DIR = "public/products";

// Image output: WebP, quality 80, max width 800px (gallery 1200px), never upscaled.
const WEBP_QUALITY = 80;
const MAX_WIDTH = 800;
const MAX_WIDTH_GALLERY = 1200;

// Shared banner files: products without their own photo all point at one file per banner.
// Named after what the banner shows; any banner not listed falls back to its file name.
const BANNER_NAMES = {
  "ImageContainer.png": "bakery",
  "Frame 90.png": "frozen-foods",
  "Frame 91.png": "meat-seafood",
  "Frame 92.png": "dairy-eggs",
  "image 55.png": "beverages",
  "image 85.png": "fruits",
  "Frame 94.png": "snacks",
  "image 133.png": "party-essentials", // the party-essentials occasion banner (used by Ground Arabica Coffee)
};

// ---------------------------------------------------------------------------
// Decisions (see seed/REVIEW.md for what each one changed)
// ---------------------------------------------------------------------------

const PRICE = 42; // MXN pesos as a number, same format the admin sends today

// Completed names for the truncated ones.
const NAME_FIXES = {
  "Artisan Sourdough...": "Artisan Sourdough Bread",
  "Chocolate Chip Co...": "Chocolate Chip Cookies",
  "Organic Greek Yog...": "Organic Greek Yogurt",
  "Creamy Almond Bu...": "Creamy Almond Butter",
  "Ground Arabica Co...": "Ground Arabica Coffee",
};

// Near-duplicates merged into one product (lower-cased name -> canonical lower-cased name).
// Milk / Whole Milk / Organic Milk are deliberately NOT merged.
const ALIASES = {
  "banana": "bananas",
  "blue berries": "blueberries",
  "fresh strawberries": "strawberries",
  "shrimps": "shrimp",
  "croissants (4-pack)": "croissant (4-pack)",
  "fresh chicken wings": "chicken wings",
};

// product.js lists these under "bakery" by mistake; those copies are dropped.
const DROP_BAKERY_COPIES = new Set(["tomatoes", "organic avocado", "carrot", "cabbage"]);

// Categories for products that have none (approved).
const CATEGORY_APPROVED = {
  "sweet mangoes": "fruits",
  "oranges": "fruits",
  "organic apples": "fruits",
  "lettuce": "fresh-produce",
  "bell pepper": "fresh-produce",
  "milk": "dairy-eggs",
  "organic milk": "dairy-eggs",
  // "banana" and "blue berries" were also approved as fruits; both now merge into
  // "bananas" / "blueberries", which already are fruits.
};

// Categories for products that still had none after the decisions (PROPOSED, needs review).
const CATEGORY_PROPOSED = {
  "sourdough bread": "bakery",
  "organic greek yogurt": "dairy-eggs",
  "creamy almond butter": "snacks",
  "ground arabica coffee": "beverages",
  "whole organic milk": "dairy-eggs",
};

// Badge overrides where "first badge in source order" picked the wrong one (approved).
// Carrot keeps "Off season" from the normal rule.
const BADGE_OVERRIDES = {
  "tomatoes": "Low in stock",
};

// Demo weight/unit per category (approved as demo values).
const UNIT_BY_CATEGORY = {
  "fresh-produce": { weight: 1, unit: "kg" },
  "fruits": { weight: 1, unit: "kg" },
  "bakery": { weight: 1, unit: "piece" },
  "frozen-foods": { weight: 500, unit: "g" },
  "meat-seafood": { weight: 1, unit: "kg" },
  "dairy-eggs": { weight: 1, unit: "l" },
  "beverages": { weight: 1, unit: "l" },
  "snacks": { weight: 200, unit: "g" },
};

// Old prices that reproduce today's deal labels with discount = round((1 - price / oldPrice) * 100).
const OLD_PRICE_FOR_DISCOUNT = { 25: 56, 15: 49.41, 10: 46.67 };

const PLACEHOLDER_NAME =
  /^(Healthy Living Item|Mexican Favourite|Seasonal Special|Party Essential|Back to School Item|BBQ & Grills Item) \d+$/;

// createdAt in source order, so sorting by createdAt keeps today's order.
const CREATED_AT_BASE = Date.UTC(2026, 0, 1);

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

// Evaluates one of our own src/data files with its image imports replaced by the
// image file name, so it runs in plain Node (no bundler, no PNG imports).
function loadDataFile(file) {
  const source = readFileSync(join(ROOT, "src/data", file), "utf8");
  const exportNames = [];
  const body = source
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (t.startsWith("import ")) {
        const name = t.split(/\s+/)[1];
        const path = t.split('"')[1]; // e.g. ../assets/image/image 82.png
        return `const ${name} = ${JSON.stringify(path.replace("../assets/image/", ""))};`;
      }
      if (t.startsWith("export const ")) {
        exportNames.push(t.split(/\s+/)[2]);
        return line.replace("export const", "const");
      }
      return line;
    })
    .join("\n");
  return new Function(`${body}\nreturn [${exportNames.join(", ")}];`)()[0];
}

// Copied from src/components/groceries/hero.js (`deals`). The 4th card
// ("Tomatoes" with the `sinamon` image, 25% off) is dropped.
const DEALS = [
  { name: "Carrot", image: "image 113.png", badge: "Off season", rating: 4.9, reviews: 312, discount: 25 },
  { name: "Cabbage", image: "image 187.png", badge: null, rating: 4.9, reviews: 312, discount: 15 },
  { name: "Tomatoes", image: "image 191.png", badge: "Low in stock", rating: 4.9, reviews: 312, discount: 10 },
];

// Copied from src/app/cart/page.jsx (`RELATED_PRODUCTS`).
const CART_RELATED = [
  { name: "Carrot", image: "image 113.png", badge: "Off season" },
  { name: "Cabbage", image: "ImageContainer (1).png", badge: null },
  { name: "Tomatoes", image: "image 110.png", badge: "Low in stock" },
  { name: "Organic Avocado", image: "image 112.png", badge: null },
  { name: "Organic Avocado", image: "image 166.png", badge: null },
];

// Source order = priority order (first value wins for category, badge, image).
// GROCERIES (src/data/groceries.js) and GROCERIES_TEASER are intentionally not exported.
const SOURCES = [
  { source: "product.js", items: loadDataFile("product.js"), collection: null },
  { source: "freshGroceries.js", items: loadDataFile("freshGroceries.js"), collection: "fresh-groceries" },
  { source: "popularThisWeek.js", items: loadDataFile("popularThisWeek.js"), collection: "popular-this-week" },
  { source: "popular.js", items: loadDataFile("popular.js"), collection: "popular" },
  { source: "occasionProducts.js", items: loadDataFile("occasionProducts.js"), collection: null },
  { source: "groceries/hero.js deals", items: DEALS, collection: "deals" },
  { source: "cart/page.jsx related", items: CART_RELATED, collection: "cart-related" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Slug/id rules (the API should copy this function for new products).
function slugify(name) {
  const s = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (s.length <= 60) return s || "product";
  const cut = s.slice(0, 60);
  const lastHyphen = cut.lastIndexOf("-");
  return lastHyphen > 0 ? cut.slice(0, lastHyphen) : cut;
}

function cleanName(raw) {
  const fixed = NAME_FIXES[raw] ?? raw;
  return fixed.trim().replace(/\s+/g, " ");
}

const keyOf = (name) => name.toLowerCase();

function pushUnique(list, value) {
  if (value !== null && value !== undefined && value !== "" && !list.includes(value)) list.push(value);
}

const mdEscape = (text) => String(text).replace(/\|/g, "\\|");

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function exportProducts() {
  // "Banner" images: one file used for 3+ different product names (category/occasion
  // banners). Computed on the raw data so the rule is the same one shown in the plan.
  const namesByImage = new Map();
  for (const { items } of SOURCES) {
    for (const item of items) {
      if (!namesByImage.has(item.image)) namesByImage.set(item.image, new Set());
      namesByImage.get(item.image).add(item.name.toLowerCase());
    }
  }
  const bannerImages = new Set([...namesByImage].filter(([, names]) => names.size >= 3).map(([img]) => img));

  // Merge by cleaned, aliased, case-insensitive name, in source order.
  const merged = new Map();
  const droppedBakery = [];
  const appliedFixes = new Set();
  const appliedAliases = new Map(); // canonical key -> Set of other names merged in

  for (const { source, items, collection } of SOURCES) {
    for (const item of items) {
      const name = cleanName(item.name);
      if (NAME_FIXES[item.name]) appliedFixes.add(item.name);
      const rawKey = keyOf(name);
      const key = ALIASES[rawKey] ?? rawKey;

      if (source === "product.js" && item.category === "bakery" && DROP_BAKERY_COPIES.has(key)) {
        droppedBakery.push(`${name} (${item.image})`);
        continue;
      }

      if (!merged.has(key)) {
        merged.set(key, {
          key,
          name, // first spelling in source order
          names: new Set(),
          sources: new Set(),
          collections: [],
          occasions: [],
          categories: [],
          images: [],
          gallery: null,
          badges: [],
          rating: null,
          reviewCount: null,
          oldPrice: null,
          order: merged.size,
        });
      }
      const p = merged.get(key);
      p.names.add(name);
      if (ALIASES[rawKey]) {
        if (!appliedAliases.has(key)) appliedAliases.set(key, new Set());
        appliedAliases.get(key).add(name);
      }
      p.sources.add(source);
      pushUnique(p.collections, collection);
      pushUnique(p.occasions, item.occasion);
      pushUnique(p.categories, item.category);
      pushUnique(p.images, item.image);
      if (!p.gallery && item.gallery?.length) p.gallery = item.gallery;
      if (item.badge) p.badges.push({ badge: item.badge, source });
      if (p.rating === null && item.rating !== undefined) {
        p.rating = Number(item.rating);
        p.reviewCount = Number(item.reviews);
      }
      if (item.discount) p.oldPrice = OLD_PRICE_FOR_DISCOUNT[item.discount];
    }
  }

  // Resolve each merged product into the API shape.
  const usedIds = new Set();
  const products = [];
  const manifest = [];
  const banners = new Map(); // banner name -> { from, productIds }
  const review = {
    hidden: [],
    needsPhoto: [],
    differentImages: [],
    categoryConflicts: [],
    categoryProposed: [],
    categoryMissing: [],
    badgeConflicts: [],
    missingFiles: [],
  };

  for (const p of [...merged.values()].sort((a, b) => a.order - b.order)) {
    const placeholder = PLACEHOLDER_NAME.test(p.name);
    const offShelf = p.badges.some((b) => b.badge === "Off the shelf");
    const available = !placeholder && !offShelf;

    let category = p.categories[0] ?? null;
    if (p.categories.length > 1) review.categoryConflicts.push(`${p.name}: ${p.categories.join(" / ")} → ${category}`);
    if (!category && CATEGORY_APPROVED[p.key]) category = CATEGORY_APPROVED[p.key];
    if (!category && CATEGORY_PROPOSED[p.key]) {
      category = CATEGORY_PROPOSED[p.key];
      review.categoryProposed.push(`${p.name} → ${category}`);
    }
    if (!category) review.categoryMissing.push(p.name);

    const realBadges = p.badges.filter((b) => b.badge !== "Off the shelf");
    const overridden = Object.hasOwn(BADGE_OVERRIDES, p.key);
    const badge = overridden ? BADGE_OVERRIDES[p.key] : realBadges[0]?.badge ?? null;
    const distinctBadges = [...new Set(p.badges.map((b) => b.badge))];
    if (distinctBadges.length > 1 || overridden) {
      review.badgeConflicts.push(
        `${p.name}: ${p.badges.map((b) => `"${b.badge}" (${b.source})`).join(", ")} → ${badge ? `"${badge}"` : "none"}${
          overridden ? " (override)" : ""
        }`
      );
    }

    let id = slugify(p.name);
    for (let n = 2; usedIds.has(id); n++) id = `${slugify(p.name)}-${n}`;
    usedIds.add(id);

    const realImages = p.images.filter((img) => !bannerImages.has(img));
    const chosen = realImages[0] ?? p.images[0];
    const usesBanner = !realImages.length;

    let image = "";
    let gallery = [];
    if (available) {
      if (usesBanner) {
        // One shared file per banner instead of a copy per product.
        const bannerName = BANNER_NAMES[chosen] ?? slugify(chosen.replace(/\.[^.]+$/, ""));
        if (!banners.has(bannerName)) banners.set(bannerName, { from: `${ASSET_DIR}/${chosen}`, productIds: [] });
        const banner = banners.get(bannerName);
        if (banner.from !== `${ASSET_DIR}/${chosen}`) {
          throw new Error(`Banner name "${bannerName}" is used for two different files: ${banner.from} and ${chosen}`);
        }
        banner.productIds.push(id);
        image = `/products/banners/${bannerName}.webp`;
        review.needsPhoto.push({ id, name: p.name, banner: chosen, bannerFile: `banners/${bannerName}.webp`, category });
      } else {
        image = `/products/${id}.webp`;
        manifest.push({ productId: id, field: "image", from: `${ASSET_DIR}/${chosen}`, to: `${PUBLIC_DIR}/${id}.webp`, maxWidth: MAX_WIDTH });
      }
      if (p.gallery) {
        gallery = p.gallery.map((file, i) => {
          const to = `${PUBLIC_DIR}/${id}-${i + 1}.webp`;
          manifest.push({ productId: id, field: `gallery[${i}]`, from: `${ASSET_DIR}/${file}`, to, maxWidth: MAX_WIDTH_GALLERY });
          return `/products/${id}-${i + 1}.webp`;
        });
      }
    }

    if (!available) {
      review.hidden.push({ id, name: p.name, reason: placeholder ? "placeholder" : "off the shelf", occasions: p.occasions });
    }

    const otherImages = p.images.filter((img) => img !== chosen);
    if (available && otherImages.length) {
      review.differentImages.push(
        `${p.name}: uses \`${chosen}\`${usesBanner ? " (banner)" : ""}; not used: ${otherImages
          .map((img) => `\`${img}\`${bannerImages.has(img) ? " (banner)" : ""}`)
          .join(", ")}`
      );
    }

    const units = category ? UNIT_BY_CATEGORY[category] : null;
    const stock = badge === "Low in stock" ? 5 : badge === "4 pieces left" ? 4 : 24;

    products.push({
      id,
      name: p.name,
      price: PRICE,
      oldPrice: p.oldPrice,
      category,
      collections: p.collections,
      occasions: p.occasions,
      badge,
      stock,
      available,
      image,
      gallery,
      weight: units?.weight ?? null,
      unit: units?.unit ?? null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      createdAt: new Date(CREATED_AT_BASE + p.order * 1000).toISOString(),
    });
  }

  for (const [name, { from, productIds }] of banners) {
    manifest.push({ productIds, field: "banner", from, to: `${PUBLIC_DIR}/banners/${name}.webp`, maxWidth: MAX_WIDTH });
  }

  for (const entry of manifest) {
    if (!existsSync(join(ROOT, entry.from))) review.missingFiles.push(entry.from);
  }

  // Shared galleries (same files used by more than one product).
  const galleryOwners = new Map();
  for (const product of products) {
    const p = merged.get(keyOf(product.name)) ?? [...merged.values()].find((m) => m.name === product.name);
    if (p?.gallery) {
      const sig = p.gallery.join("|");
      if (!galleryOwners.has(sig)) galleryOwners.set(sig, []);
      galleryOwners.get(sig).push(product.name);
    }
  }
  const sharedGalleries = [...galleryOwners.values()].filter((names) => names.length > 1);

  // ---- counts ----
  const visible = products.filter((p) => p.available);
  const count = (list, fn) => list.filter(fn).length;
  const collectionNames = ["fresh-groceries", "popular", "popular-this-week", "deals", "cart-related"];
  const categoryNames = Object.keys(UNIT_BY_CATEGORY);
  const occasionNames = [...new Set(products.flatMap((p) => p.occasions))];
  const counts = {
    sourceItems: SOURCES.reduce((n, s) => n + s.items.length, 0),
    total: products.length,
    visible: visible.length,
    hidden: products.length - visible.length,
    collections: Object.fromEntries(
      collectionNames.map((c) => [c, `${count(visible, (p) => p.collections.includes(c))} / ${count(products, (p) => p.collections.includes(c))}`])
    ),
    occasions: Object.fromEntries(
      occasionNames.map((o) => [o, `${count(visible, (p) => p.occasions.includes(o))} / ${count(products, (p) => p.occasions.includes(o))}`])
    ),
    categories: Object.fromEntries(
      [...categoryNames, null].map((c) => [c ?? "(none)", `${count(visible, (p) => p.category === c)} / ${count(products, (p) => p.category === c)}`])
    ),
    manifestFiles: manifest.length,
    imagesOwnPhoto: count(manifest, (e) => e.field === "image"),
    imagesGallery: count(manifest, (e) => e.field.startsWith("gallery")),
    imagesBanner: count(manifest, (e) => e.field === "banner"),
  };

  // ---- write seed/ ----
  mkdirSync(SEED_DIR, { recursive: true });
  writeFileSync(join(SEED_DIR, "products.json"), `${JSON.stringify(products, null, 2)}\n`);
  writeFileSync(join(SEED_DIR, "image-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(
    join(SEED_DIR, "REVIEW.md"),
    buildReview({ counts, review, droppedBakery, appliedFixes, appliedAliases, sharedGalleries, bannerImages, products })
  );

  console.log("Wrote seed/products.json, seed/image-manifest.json, seed/REVIEW.md (no images copied).");
  console.log(JSON.stringify(counts, null, 2));
}

function buildReview({ counts, review, droppedBakery, appliedFixes, appliedAliases, sharedGalleries, bannerImages, products }) {
  const lines = [];
  const add = (...l) => lines.push(...l);
  const table = (header, rows) => {
    add(`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`);
    rows.forEach((r) => add(`| ${r.map(mdEscape).join(" | ")} |`));
    add("");
  };
  const list = (items, empty = "_None._") => {
    if (!items.length) add(empty);
    items.forEach((i) => add(`- ${i}`));
    add("");
  };

  add("# Product seed review", "");
  add("Generated by `node scripts/export-products.mjs`. Regenerate after changing the decisions in that script.", "");
  add("Nothing here is in the database yet, and no images have been copied.", "");

  add("## Counts", "");
  table(["", "Count"], [
    ["Source items read (excluding GROCERIES and teasers)", counts.sourceItems],
    ["Products after merging", counts.total],
    ["Visible (`available: true`)", counts.visible],
    ["Hidden (`available: false`)", counts.hidden],
    ["Image files to create (image-manifest.json)", counts.manifestFiles],
    ["… own photos (max 800px)", counts.imagesOwnPhoto],
    ["… gallery images (max 1200px)", counts.imagesGallery],
    ["… shared banners (max 800px)", counts.imagesBanner],
  ]);
  add(`All images are converted to WebP, quality ${WEBP_QUALITY}, resized down only (never upscaled).`, "");
  add("### Per collection (visible / total)", "");
  table(["Collection", "Visible / total"], Object.entries(counts.collections));
  add("### Per occasion (visible / total)", "");
  table(["Occasion", "Visible / total"], Object.entries(counts.occasions));
  add("### Per category (visible / total)", "");
  table(["Category", "Visible / total"], Object.entries(counts.categories));

  add("## Needs a decision", "");
  add("### Proposed categories (products that had none after your decisions)", "");
  list(review.categoryProposed);
  add("### Still without a category", "");
  add("These would fail the admin's category check if edited. All are hidden placeholders unless listed otherwise.", "");
  const missingPlaceholders = review.categoryMissing.filter((n) => PLACEHOLDER_NAME.test(n));
  const missingOther = review.categoryMissing.filter((n) => !PLACEHOLDER_NAME.test(n));
  list([
    ...(missingPlaceholders.length ? [`${missingPlaceholders.length} hidden placeholders (category \`null\`)`] : []),
    ...missingOther,
  ]);
  add("### Badge conflicts (first badge in source order wins; stock follows the chosen badge)", "");
  list(review.badgeConflicts);

  add("## Hidden products", "");
  const placeholders = review.hidden.filter((h) => h.reason === "placeholder");
  const others = review.hidden.filter((h) => h.reason !== "placeholder");
  add(`**${placeholders.length} placeholders** (image \`""\`):`, "");
  const byOccasion = {};
  placeholders.forEach((h) => (byOccasion[h.occasions.join(",")] ??= []).push(h.name));
  table(["Occasion", "Items"], Object.entries(byOccasion).map(([o, names]) => [o, `${names.length}: ${names[0]} … ${names[names.length - 1]}`]));
  add("**Other hidden products** (image `\"\"`):", "");
  table(["id", "Name", "Reason"], others.map((h) => [h.id, h.name, h.reason]));

  add("## Needs a real photo (visible, using a shared banner image)", "");
  add(
    `${review.needsPhoto.length} products. They share one file per banner in \`public/products/banners/\`. To give one a real photo, add \`public/products/<id>.webp\` and change its \`image\`.`,
    ""
  );
  table(
    ["id", "Name", "Category", "Banner source", "Shared file"],
    review.needsPhoto.map((n) => [n.id, n.name, n.category ?? "-", n.banner, n.bannerFile])
  );

  add("## Same name, different images", "");
  add("The first non-banner image in source order is used.", "");
  list(review.differentImages);
  add("### Shared galleries", "");
  list(sharedGalleries.map((names) => `${names.join(" and ")} use the same gallery files`));

  add("## Applied decisions", "");
  add("### Merged near-duplicates", "");
  list([...appliedAliases].map(([key, names]) => {
    const product = products.find((p) => keyOf(p.name) === key);
    return `${product?.name ?? key} ← ${[...names].join(", ")}`;
  }));
  add("Not merged on purpose: Milk, Whole Milk, Organic Milk.", "");
  add("### Completed names", "");
  list([...appliedFixes].map((raw) => `"${raw}" → "${NAME_FIXES[raw]}"`));
  add("### Removed bakery copies", "");
  list(droppedBakery);
  add("### Remaining category conflicts", "");
  list(review.categoryConflicts);
  add("### Deals (discount = round((1 - price / oldPrice) × 100))", "");
  table(
    ["Product", "price", "oldPrice", "Discount"],
    products.filter((p) => p.oldPrice).map((p) => [p.name, p.price, p.oldPrice, `${Math.round((1 - p.price / p.oldPrice) * 100)}%`])
  );
  add("Dropped: the 4th deal card (\"Tomatoes\", `sinamon` image, 25%).", "");
  add("### Demo units per category", "");
  table(["Category", "weight", "unit"], Object.entries(UNIT_BY_CATEGORY).map(([c, u]) => [c, u.weight, u.unit]));
  add("### Stock", "");
  add('24 by default, 5 where the badge is "Low in stock", 4 where it is "4 pieces left" (demo values).', "");

  add("## Not exported", "");
  list([
    "`src/data/groceries.js` (GROCERIES) and its `/groceries/[slug]` route: dropped.",
    "`src/data/groceriesTeaser.js`: stays as promo cards in the site code. Suggested links: Sweet Mangoes (×2) → `sweet-mangoes`, Local Lettuce → `lettuce`, Cucumbers → `cucumber`.",
    `Banner image files (shared by 3+ names): ${[...bannerImages].map((b) => `\`${b}\``).join(", ")}.`,
  ]);

  add("## Missing source image files", "");
  list(review.missingFiles.map((f) => `\`${f}\``));

  return `${lines.join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// --copy-images
// ---------------------------------------------------------------------------

async function copyImages() {
  const manifestPath = join(SEED_DIR, "image-manifest.json");
  if (!existsSync(manifestPath)) {
    console.error("seed/image-manifest.json not found. Run without --copy-images first.");
    process.exit(1);
  }

  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error("sharp is not installed (it normally comes with Next.js). Nothing was written.");
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  // Check every path before writing anything: only read from the assets folder,
  // only write .webp files inside public/products/.
  for (const { from, to } of manifest) {
    if (!from.startsWith(`${ASSET_DIR}/`) || !to.startsWith(`${PUBLIC_DIR}/`) || !to.endsWith(".webp") || to.includes("..")) {
      console.error(`Refusing unexpected path: ${from} -> ${to}. Nothing was written.`);
      process.exit(1);
    }
  }

  let written = 0;
  let skipped = 0;
  let missing = 0;
  for (const { from, to, maxWidth } of manifest) {
    const src = join(ROOT, from);
    const dest = join(ROOT, to);
    if (!existsSync(src)) {
      console.warn(`missing source, skipped: ${from}`);
      missing++;
      continue;
    }
    if (existsSync(dest)) {
      skipped++;
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    await sharp(src)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(dest);
    written++;
  }
  console.log(
    `Wrote ${written} WebP files, already there (left as is) ${skipped}, missing source ${missing}, into ${PUBLIC_DIR}/.`
  );
}

if (process.argv.includes("--copy-images")) await copyImages();
else exportProducts();
