import { create } from "zustand";

export const useOrderStore = create((set) => ({
  deliveryData: {},
  paymentMethod: "",
  orderNumber: "",
  tip: 0,
  deliveryFee: 0,

  orderItems: [],
  orderSubtotal: 0,
  orderTotalWeight: 0,

  setDeliveryData: (data) => set({ deliveryData: data }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setOrderNumber: (number) => set({ orderNumber: number }),

  setTip: (amount) => set({ tip: amount }),

  setDeliveryFee: (amount) => set({ deliveryFee: amount }),

  setOrderItems: (items) => set({ orderItems: items }),

  setOrderSubtotal: (amount) => set({ orderSubtotal: amount }),

  setOrderTotalWeight: (weight) => set({ orderTotalWeight: weight }),
}));