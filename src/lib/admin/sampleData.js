// =============================================================================
// SAMPLE DATA: NOT REAL. The API has no orders or customers endpoints yet.
//
// Everything order-related on the admin Overview (revenue, order counts,
// product sold, new customers, sales chart, top selling, recent orders, active
// deliveries) is calculated from SAMPLE_ORDERS below. To go live, replace
// getSampleOrders() with the API's orders (same shape) and keep the helpers;
// then remove the "Sample data" labels in the Overview components.
//
// Order shape:
//   { id: "FM-3904", customer: "Mateo Sánchez", address: "Av. Reforma 120, Roma Norte",
//     createdAt: Date, status: "pending" | "processing" | "delivered",
//     delivery: null | { stage: "in-transit" | "out-for-delivery" | "arriving-soon", eta: Date },
//     items: [{ productId: "organic-avocado", name: "Organic Hass Avocado", qty: 2, price: 42 }],
//     total: number (MXN) }
//
// Product ids are real ids from the API, so thumbnails come from real products.
// Each calendar day's orders come from a seed made from that date, so a day
// always shows the same orders, whichever day you look at it from. Statuses
// are worked out "as of" a moment (now, or the end of a past day).
// =============================================================================

const SAMPLE_PRODUCTS = [
  { productId: "organic-avocado", name: "Organic Hass Avocado", price: 42 },
  { productId: "whole-milk", name: "Organic Whole Milk", price: 38 },
  { productId: "sweet-mangoes", name: "Sweet Manila Mangoes", price: 55 },
  { productId: "lettuce", name: "Local Lettuce", price: 24 },
  { productId: "cucumber", name: "Cucumbers", price: 19 },
  { productId: "sourdough-bread", name: "Sourdough Bread", price: 65 },
  { productId: "tomatoes", name: "Tomatoes", price: 32 },
  { productId: "free-range-eggs", name: "Free-range Eggs", price: 78 },
  { productId: "bananas", name: "Bananas", price: 22 },
  { productId: "chicken-breast", name: "Chicken Breast", price: 129 },
];

// Customers are first name + last name, so new customers keep appearing.
const FIRST_NAMES = [
  "Mateo", "Sofía", "Lucas", "Valentina", "Diego", "Camila", "Santiago", "Isabella", "Emiliano", "Regina",
  "Leonardo", "Ximena", "Sebastián", "Renata", "Daniel", "Mariana", "Nicolás", "Fernanda", "Matías", "Andrea",
];
const LAST_NAMES = [
  "Sánchez", "Rodríguez", "Hernández", "López", "Martínez", "García", "Pérez", "Torres", "Ramírez", "Flores",
  "Gómez", "Díaz", "Cruz", "Morales", "Reyes", "Ortiz", "Vargas", "Castillo", "Jiménez", "Ruiz",
];

const SAMPLE_ADDRESSES = [
  "Av. Reforma 120, Roma Norte", "Calle Durango 88, Condesa", "Blvd. Miguel Ángel de Quevedo 240, Coyoacán",
  "Av. Insurgentes Sur 1602, Del Valle", "Calle Puebla 45, Roma Norte", "Av. Álvaro Obregón 130, Roma Norte",
  "Calle Ámsterdam 210, Hipódromo", "Av. Universidad 1000, Santa Cruz Atoyac", "Calle Mazatlán 77, Condesa",
  "Av. Coyoacán 1435, Del Valle",
];

const DAYS = 14; // two weeks, so "this week" can be compared with "last week"
const DAY_MS = 86_400_000;
const MAX_ORDERS_PER_DAY = 30; // order numbers are day number x 30 + index

// Small seeded random generator (mulberry32): same sample on every load.
function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// The last moment of a day (23:59:59.999): "as of" time for a past day.
export function endOfDay(date) {
  return new Date(addDays(startOfDay(date), 1).getTime() - 1);
}

// Whole calendar days since 1 Jan 2000, for seeds and order numbers.
function dayNumber(day) {
  return Math.round(
    (Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) - Date.UTC(2000, 0, 1)) / DAY_MS
  );
}

// Status of an order at a given moment. Pending for the first hour, then
// on the road, then delivered about 3h30m after ordering.
export function orderStatus(createdAt, at) {
  const ageMinutes = (at - createdAt) / 60_000;
  if (ageMinutes < 60) return { status: "pending", delivery: null };
  if (ageMinutes < 210) {
    const stage = ageMinutes < 110 ? "in-transit" : ageMinutes < 160 ? "out-for-delivery" : "arriving-soon";
    // ETA from the order time, so every order has its own.
    return { status: "processing", delivery: { stage, eta: new Date(createdAt.getTime() + 230 * 60_000) } };
  }
  return { status: "delivered", delivery: null };
}

// All of one calendar day's orders (statuses not set yet), oldest first.
function ordersForDay(day) {
  const n = dayNumber(day);
  const rand = seededRandom(20260817 + n * 7919);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  // Busier on Fridays and weekends.
  const busy = [0, 5, 6].includes(day.getDay());
  const count = Math.min(MAX_ORDERS_PER_DAY, 12 + (busy ? 4 : 0) + Math.floor(rand() * 7));
  const times = Array.from({ length: count }, () => 7 * 60 + Math.floor(rand() * 14 * 60)).sort((a, b) => a - b);

  return times.map((minutes, index) => {
    const lines = 1 + Math.floor(rand() * 3);
    const items = [];
    for (let i = 0; i < lines; i++) {
      const product = pick(SAMPLE_PRODUCTS);
      if (items.some((it) => it.productId === product.productId)) continue;
      items.push({ ...product, qty: 1 + Math.floor(rand() * 3) });
    }
    return {
      id: `FM-${n * MAX_ORDERS_PER_DAY + index}`,
      customer: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      address: pick(SAMPLE_ADDRESSES),
      createdAt: new Date(startOfDay(day).getTime() + minutes * 60_000),
      items,
      total: items.reduce((sum, it) => sum + it.qty * it.price, 0),
    };
  });
}

// Sample orders for the 14 days up to `asOf` (now, or the end of a past day),
// oldest first, with each order's status at that moment.
export function getSampleOrders(asOf = new Date()) {
  const lastDay = startOfDay(asOf);
  const orders = [];
  for (let back = DAYS - 1; back >= 0; back--) {
    for (const order of ordersForDay(addDays(lastDay, -back))) {
      if (order.createdAt > asOf) break; // only orders placed by then
      orders.push({ ...order, ...orderStatus(order.createdAt, asOf) });
    }
  }
  return orders;
}

// ---- Helpers (keep these when the real orders arrive) ----------------------

const sum = (list, fn) => list.reduce((acc, x) => acc + fn(x), 0);
const unitsIn = (orders) => sum(orders, (o) => sum(o.items, (it) => it.qty));

function between(orders, from, to) {
  return orders.filter((o) => o.createdAt >= from && o.createdAt < to);
}

// Percentage change from `before` to `after`, or null when there is no base.
export function percentChange(after, before) {
  if (!before) return null;
  return ((after - before) / before) * 100;
}

// Stat cards for the day of `asOf` (today so far, or a whole past day).
// Change = that day vs the day before up to the same time of day (a fair
// comparison mid-day; for a past day it is full day vs full day).
export function getOrderStats(orders, asOf = new Date()) {
  const day = startOfDay(asOf);
  const prevDay = addDays(day, -1);
  const prevAsOf = new Date(prevDay.getTime() + (asOf - day));
  const dayOrders = between(orders, day, addDays(day, 1));
  const prevOrders = between(orders, prevDay, prevAsOf);

  const firstOrder = new Map(); // customer -> first order date in the period
  for (const o of orders) if (!firstOrder.has(o.customer)) firstOrder.set(o.customer, o.createdAt);
  const newCustomersBetween = (from, to) => [...firstOrder.values()].filter((d) => d >= from && d < to).length;

  // `at`: the moment statuses are counted at (orders carry their status as of `asOf`).
  const metric = (list, at) => ({
    revenue: sum(list, (o) => o.total),
    orders: list.length,
    completed: list.filter((o) => orderStatus(o.createdAt, at).status === "delivered").length,
    sold: unitsIn(list),
  });
  const d = metric(dayOrders, asOf);
  const p = metric(prevOrders, prevAsOf);

  return {
    revenue: { value: d.revenue, change: percentChange(d.revenue, p.revenue) },
    orders: { value: d.orders, change: percentChange(d.orders, p.orders) },
    // Pending is a snapshot at `asOf`, so no change is shown.
    pending: { value: orders.filter((o) => o.status === "pending").length, change: null },
    completed: { value: d.completed, change: percentChange(d.completed, p.completed) },
    newCustomers: {
      value: newCustomersBetween(day, addDays(day, 1)),
      change: percentChange(newCustomersBetween(day, addDays(day, 1)), newCustomersBetween(prevDay, prevAsOf)),
    },
    sold: { value: d.sold, change: percentChange(d.sold, p.sold) },
  };
}

// Revenue per day for 7 full days, oldest first, for the sales chart.
// includeDay false (today): the 7 days ending yesterday, so a half-finished
// day doesn't dip. includeDay true (a past day): the 7 days ending that day.
export function getDailySales(orders, asOf = new Date(), includeDay = false) {
  const end = addDays(startOfDay(asOf), includeDay ? 1 : 0);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(end, i - 7);
    return { date: day, revenue: sum(between(orders, day, addDays(day, 1)), (o) => o.total) };
  });
}

// Best sellers by units in the week ending on the day of `asOf`, with change
// vs the week before.
export function getTopSelling(orders, asOf = new Date(), limit = 4) {
  const tomorrow = addDays(startOfDay(asOf), 1);
  const weekStart = addDays(tomorrow, -7);
  const prevStart = addDays(weekStart, -7);
  const tally = (list) => {
    const map = new Map();
    for (const o of list) for (const it of o.items) map.set(it.productId, (map.get(it.productId) ?? 0) + it.qty);
    return map;
  };
  const thisWeek = tally(between(orders, weekStart, tomorrow));
  const lastWeek = tally(between(orders, prevStart, weekStart));
  const allTime = tally(orders);
  const names = new Map(SAMPLE_PRODUCTS.map((p) => [p.productId, p.name]));

  // units: sold this week; totalUnits: sold over the whole period (14 days here).
  return [...thisWeek.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId, units]) => ({
      productId,
      name: names.get(productId) ?? productId,
      units,
      totalUnits: allTime.get(productId) ?? units,
      change: percentChange(units, lastWeek.get(productId) ?? 0),
    }));
}

export function getRecentOrders(orders, limit = 5) {
  return [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
}

export function getActiveDeliveries(orders, limit = 5) {
  return orders
    .filter((o) => o.delivery)
    .sort((a, b) => a.delivery.eta - b.delivery.eta)
    .slice(0, limit);
}
