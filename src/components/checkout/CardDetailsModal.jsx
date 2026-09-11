"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function CardDetailsModal({
  cardDetailsOpen,
  setCardDetailsOpen,
  onConfirmPayment,
}) {
  const [cardData, setCardData] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!cardDetailsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-[20px]">
      <div className="relative w-full max-w-[420px] rounded-[12px] bg-[#FFFFFF] p-[24px]">

        {/* Close */}
        <button
          type="button"
          onClick={() => setCardDetailsOpen(false)}
          className="absolute right-[20px] top-[20px] rounded-full p-[4px] text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <h2 className="text-base font-bold text-[#1F2937]">
          Add payment method
        </h2>

        <p className="mt-[6px] text-xs text-gray-500">
          Your payment information is processed securely.
        </p>

        {/* Form */}
        <div className="mt-[24px] flex flex-col gap-[16px] bg-[#FBF8F2] p-4 rounded-xl">

          <h3 className="text-xs font-bold text-[#1F2937]">
            Credit or Debit Card Details
          </h3>

          {/* Cardholder name */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="cardholder"
              className="text-xs font-semibold text-[#1F2937]"
            >
              Cardholder name
            </label>

            <input
              id="cardholder"
              type="text"
              name="cardholder"
              value={cardData.cardholder}
              onChange={handleChange}
              placeholder="e.g. Jonathan Doe"
              className="w-full rounded-[8px] border  bg-white border-gray-200 p-2 text-xs outline-none focus:border-[#3E5730]"
            />
          </div>

          {/* Card number */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="cardNumber"
              className="text-xs font-semibold text-[#1F2937]"
            >
              Card number
            </label>

            <input
              id="cardNumber"
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleChange}
              placeholder="0000 0000 0000 0000"
              className="w-full rounded-[8px] border  bg-white border-gray-200 p-2 text-xs outline-none focus:border-[#3E5730]"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="flex gap-[12px]">

            <div className="flex flex-1 flex-col gap-[6px]">
              <label
                htmlFor="expiry"
                className="text-xs font-semibold text-[#1F2937]"
              >
                Expiry date
              </label>

              <input
                id="expiry"
                type="text"
                name="expiry"
                value={cardData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full rounded-[8px] border border-gray-200 bg-white p-2 text-xs outline-none focus:border-[#3E5730]"
              />
            </div>

            <div className="flex flex-1 flex-col gap-[6px]">
              <label
                htmlFor="cvv"
                className="text-xs font-semibold text-[#1F2937]"
              >
                Security code (CVV)
              </label>

              <input
                id="cvv"
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                placeholder="123"
                className="w-full rounded-[8px] border border-gray-200 bg-white p-2 text-xs outline-none focus:border-[#3E5730]"
              />
            </div>

          </div>

          {/* Save card */}
          <label className="flex gap-[8px]">
            <input
              type="checkbox"
              defaultChecked
              className="mt-[3px]   accent-[#3E5730]"


            />

            <span className="text-xs text-[#1F2937]">
              <span className="font-semibold">
                Save card for future checkout
              </span>

              <span className="mt-[4px] block text-xs text-gray-500">
                This card will be stored as your primary payment method for
                quicker grocery deliveries.
              </span>
            </span>
          </label>



        </div>
        {/* Buttons */}
        <div className="mt-[4px]   flex items-end items-center justify-end gap-[12px]">

          <button
            type="button"
            onClick={() => setCardDetailsOpen(false)}
            className="rounded-[8px]  border-1 border-gray-300 px-[20px] py-[8px] text-xs font-semibold text-gray-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirmPayment}
            className="flex items-center justify-center rounded-[8px] bg-[#3E5730] py-[8px] px-[8px] text-xs font-semibold cursor-pointer text-white"
          >
            Confirm payment method
          </button>

        </div>
      </div>
    </div>
  );
}

