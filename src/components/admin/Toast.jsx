"use client";

import { create } from "zustand";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const useToastStore = create((set) => ({
  toasts: [],
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

let nextId = 1;

function push(type, message) {
  const id = nextId++;
  // Keep at most 3 on screen.
  useToastStore.setState((s) => ({ toasts: [...s.toasts, { id, type, message }].slice(-3) }));
  setTimeout(() => useToastStore.getState().dismiss(id), 3000);
}

export const toast = {
  success: (message) => push("success", message),
  error: (message) => push("error", message),
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-32px)] flex-col gap-3 sm:right-6 sm:top-6 sm:w-[360px]">
      {toasts.map((t) => {
        const isError = t.type === "error";
        const Icon = isError ? AlertCircle : CheckCircle2;
        return (
          <div
            key={t.id}
            role={isError ? "alert" : "status"}
            className="flex flex-col overflow-hidden rounded-[14px] bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-[20px] sm:py-[18px]">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-[12px]">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-[28px] sm:w-[28px] ${
                    isError ? "bg-red-600" : "bg-[#3E5730]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-white sm:h-[16px] sm:w-[16px]" strokeWidth={2.5} fill="none" />
                </span>
                <span className="break-words text-base font-bold text-[#1F2937] sm:text-[17px]">{t.message}</span>
              </div>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="shrink-0">
                <X className="h-5 w-5 text-[#1F2937]" strokeWidth={2} />
              </button>
            </div>
            <div className={`h-[6px] w-full ${isError ? "bg-red-600" : "bg-[#3E5730]"}`} />
          </div>
        );
      })}
    </div>
  );
}
