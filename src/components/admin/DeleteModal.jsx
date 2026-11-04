"use client";

import { useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteModal({ productName, busy, onConfirm, onCancel }) {
  // Escape closes the modal, except while the delete is in flight.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
      className="fixed inset-0 z-[200] flex items-center justify-center px-[16px]"
    >
      <button
        type="button"
        aria-label="Cancel delete"
        tabIndex={-1}
        onClick={busy ? undefined : onCancel}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />
      <div className="relative w-full max-w-[460px] rounded-[16px] bg-white p-[24px] text-center shadow-xl sm:p-[28px]">
        <span className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-red-50">
          <Trash2 className="h-[22px] w-[22px] text-red-600" strokeWidth={2} />
        </span>
        <p id="delete-title" className="mt-[14px] text-[20px] font-bold text-[#1F2937]">
          Delete this product?
        </p>
        <p id="delete-desc" className="mt-[8px] break-words text-[14px] text-gray-500">
          “{productName}” will be removed. This can’t be undone.
        </p>
        <div className="mt-[20px] flex flex-col gap-[10px]">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex w-full items-center justify-center gap-[8px] rounded-[8px] bg-red-600 py-[10px] text-[14px] font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-[16px] w-[16px] animate-spin" strokeWidth={2} />}
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={busy}
            className="w-full rounded-[8px] border border-[#D8DADD] py-[10px] text-[14px] font-semibold text-[#1F2936] hover:bg-black/5 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
