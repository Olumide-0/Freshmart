import { create } from "zustand";

const DEFAULT_SIZE = "1 Kg";

// One cart line per product id + selected size.
export const cartLineId = (id, selectedSize) => `${id}|${selectedSize}`;

// Adds `incoming` to `items`, merging its quantity into an existing line with the same lineId.
function mergeLine(items, incoming) {
  const existing = items.find((i) => i.lineId === incoming.lineId);
  if (!existing) return [...items, incoming];
  return items.map((i) =>
    i.lineId === incoming.lineId ? { ...i, quantity: i.quantity + incoming.quantity } : i
  );
}

export const useCartStore = create((set) => ({
  items: [],

  addItem: (product, quantity = 1) =>
    set((state) => {
      const selectedSize = product.selectedSize ?? DEFAULT_SIZE;
      return {
        items: mergeLine(state.items, {
          lineId: cartLineId(product.id, selectedSize),
          id: product.id,
          name: product.name,
          image: product.image,
          price: Number(product.price) || 0,
          badge: product.badge || null,
          weight: product.weight ?? null,
          unit: product.unit ?? null,
          description:
            product.description ??
            "Creamy, rich and perfectly ripe. Great for salads, sandwiches and more.",
          sizes: product.sizes ?? ["500g", "1 Kg", "5kg", "Custom"],
          selectedSize,
          quantity,
        }),
      };
    }),

  removeItem: (lineId) =>
    set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

  updateQuantity: (lineId, delta) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.lineId === lineId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      ),
    })),

  // Changing the size changes the line's key; if that size is already in the
  // cart for this product, the two lines merge.
  setCustomQuantity: (lineId, amount, unit) =>
    set((state) => {
      const line = state.items.find((i) => i.lineId === lineId);
      if (!line) return state;
      const selectedSize = `${amount}${unit}`;
      const updated = { ...line, selectedSize, lineId: cartLineId(line.id, selectedSize) };
      if (updated.lineId === lineId) return state;
      const rest = state.items.filter((i) => i.lineId !== lineId);
      if (rest.some((i) => i.lineId === updated.lineId)) return { items: mergeLine(rest, updated) };
      return { items: state.items.map((i) => (i.lineId === lineId ? updated : i)) };
    }),

  clearCart: () => set({ items: [] }),
}));
