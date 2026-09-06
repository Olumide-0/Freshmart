"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";

const UNITS = ["kg", "g", "lbs", "pieces"];

export default function CustomQuantityModal({ onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("kg");

  const handleAdd = () => {
    if (!amount || Number(amount) <= 0) return;
    onConfirm(amount, unit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-[16px]">
      <div className="w-full max-w-[560px] rounded-[32px]  bg-white p-[24px] sm:p-[32px] shadow-2xl">
        <div className="border-[2px] border-[#F3D7AD] p-[24px] rounded-[32px] ">
            <div className="flex items-center justify-between ">
          <h2 className="text-[20px] font-extrabold text-[#1F2937]">Enter Custom Quantity</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-[36px] w-[36px] rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-[20px] w-[20px]" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.1"
            placeholder="0.5"
            className="flex-1 rounded-[12px] border-2 border-[#3E5730] px-[18px] py-[14px] text-[16px] text-[#1F2937] focus:outline-none"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[120px] rounded-[12px] border border-gray-200 bg-[#F6F0E3] px-[16px] py-[14px] text-[15px] font-semibold text-[#1F2937] focus:outline-none"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-[12px] flex items-center gap-[8px] text-[13px] text-gray-400">
          <Info className="h-[14px] w-[14px]" strokeWidth={2} />
          Enter your desired quantity (options: kg, g, lbs, pieces)
        </p>

        <div className="mt-[28px] flex gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 rounded-[12px] border border-gray-300 py-[14px] text-[15px] font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 rounded-[12px] bg-[#3E5730] py-[14px] text-[15px] font-semibold text-white shadow-md hover:bg-[#324727] transition-colors"
          >
            Add to cart
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}