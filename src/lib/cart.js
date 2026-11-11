// Pure helpers for cart lines (safe in Client Components).

// 168 -> "168", 93.34 -> "93.34"
export function formatAmount(value) {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

// price x quantity for one cart line, as a display string.
export function lineTotal(item) {
  return formatAmount(Number(item.price) * item.quantity);
}

// Matches the top banner: "Free deliveries on orders over MXN $699".
export const FREE_DELIVERY_THRESHOLD = 699;

// { remaining: "657", percent: 6 } for a 42 subtotal; { remaining: "0", percent: 100 } at 699+.
// percent rounds down so the bar never shows 100% while money is still missing.
export function freeDeliveryProgress(subtotal) {
  const total = Math.max(0, Number(subtotal) || 0);
  const left = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  return {
    remaining: formatAmount(Math.round(left * 100) / 100),
    percent: left === 0 ? 100 : Math.min(99, Math.floor((total / FREE_DELIVERY_THRESHOLD) * 100)),
  };
}

const KG_PER_UNIT = { g: 0.001, kg: 1, lb: 0.453592, lbs: 0.453592 };
const WEIGHT_UNITS = ["g", "kg"];

// "500g" -> 0.5, "1 Kg" -> 1, "5kg" -> 5, "2lbs" -> 0.907..., "3pieces" -> null
export function sizeToKg(size) {
  const match = /^\s*(\d+(?:\.\d+)?)\s*([a-z]+)\s*$/i.exec(String(size ?? ""));
  if (!match) return null;
  const factor = KG_PER_UNIT[match[2].toLowerCase()];
  return factor == null ? null : Number(match[1]) * factor;
}

// Weight of one line in kg, or null when it is not sold by weight
// (product unit piece, l or ml, or a size that is not a weight).
export function lineWeightKg(item) {
  if (item.unit && !WEIGHT_UNITS.includes(item.unit)) return null;
  const kg = sizeToKg(item.selectedSize);
  return kg == null ? null : kg * item.quantity;
}

// Total of all weighable lines in kg, rounded to 2 decimals.
export function cartTotalWeightKg(items) {
  const total = items.reduce((sum, item) => sum + (lineWeightKg(item) ?? 0), 0);
  return Math.round(total * 100) / 100;
}
