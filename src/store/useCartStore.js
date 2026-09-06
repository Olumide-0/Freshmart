import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [], // { id, name, image, price, badge, description, rating, reviews, sizes, selectedSize, quantity }

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: Number(product.price) || 0,
            badge: product.badge ?? null,
            description:
              product.description ??
              "Creamy, rich and perfectly ripe. Great for salads, sandwiches and more.",
            rating: product.rating ?? 4.9,
            reviews: product.reviews ?? 312,
            sizes: product.sizes ?? ["500g", "1 Kg", "5kg", "Custom"],
            selectedSize: product.selectedSize ?? "1 Kg",
            quantity: 1,
          },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      ),
    })),

  setCustomQuantity: (id, amount, unit) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, selectedSize: `${amount}${unit}` } : i
      ),
    })),

  clearCart: () => set({ items: [] }),
}));