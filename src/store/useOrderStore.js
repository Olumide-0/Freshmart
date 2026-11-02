import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set) => ({
  deliveryData: {},
  paymentMethod: "",
  orderNumber: "",
  tip: 0,
  deliveryFee: 0,

  orderItems: [],
  orderSubtotal: 0,
  orderTotalWeight: 0,
  orderTip: 0,
  orderPlacedAt: 0,

  setDeliveryData: (data) => set({ deliveryData: data }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setOrderNumber: (number) => set({ orderNumber: number }),

  setTip: (amount) => set({ tip: amount }),

  setDeliveryFee: (amount) => set({ deliveryFee: amount }),

  setOrderItems: (items) => set({ orderItems: items }),

  setOrderSubtotal: (amount) => set({ orderSubtotal: amount }),

  setOrderTotalWeight: (weight) => set({ orderTotalWeight: weight }),

  setOrderTip: (amount) => set({ orderTip: amount }),

  setOrderPlacedAt: (timestamp) => set({ orderPlacedAt: timestamp }),
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => sessionStorage),
      // Rehydrated manually on the client (see confirmation page) so the
      // server render and first client render match.
      skipHydration: true,
    }
  )
);
