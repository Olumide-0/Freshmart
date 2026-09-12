
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

  const [errors, setErrors] = useState({});

  const validateCard = () => {
    const newErrors = {};

    // Cardholder
    if (!cardData.cardholder.trim()) {
      newErrors.cardholder = "Cardholder name is required";
    }

    // Card number
    const cardNumber = cardData.cardNumber.replace(/\s/g, "");

    if (!cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Expiry
    if (!cardData.expiry.trim()) {
      newErrors.expiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = "Enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = cardData.expiry.split("/");

      const expiryMonth = Number(month);
      const expiryYear = Number(`20${year}`);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        newErrors.expiry = "Card has expired";
      }
    }

    // CVV
    if (!cardData.cvv.trim()) {
      newErrors.cvv = "Security code is required";
    } else if (!/^\d{3}$/.test(cardData.cvv)) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Card number: numbers only, max 16 digits
    if (name === "cardNumber") {
      updatedValue = value.replace(/\D/g, "").slice(0, 16);
    }

    // CVV: numbers only, max 3 digits
    if (name === "cvv") {
      updatedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    // Expiry: numbers only + automatically add /
    if (name === "expiry") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 4);

      if (numbersOnly.length >= 3) {
        updatedValue = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
      } else {
        updatedValue = numbersOnly;
      }
    }

    setCardData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Clear the error when the user starts fixing the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
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
        <div className="mt-[24px] flex flex-col gap-[16px] rounded-xl bg-[#FBF8F2] p-4">

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
              className={`w-full rounded-[8px] border bg-white p-2 text-xs outline-none focus:border-[#3E5730] ${
                errors.cardholder
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />

            {errors.cardholder && (
              <p className="text-xs text-red-500">
                {errors.cardholder}
              </p>
            )}
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
              inputMode="numeric"
              maxLength={16}
              placeholder="0000 0000 0000 0000"
              className={`w-full rounded-[8px] border bg-white p-2 text-xs outline-none focus:border-[#3E5730] ${
                errors.cardNumber
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />

            {errors.cardNumber && (
              <p className="text-xs text-red-500">
                {errors.cardNumber}
              </p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="flex gap-[12px]">

            {/* Expiry */}
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
                inputMode="numeric"
                maxLength={5}
                placeholder="MM/YY"
                className={`w-full rounded-[8px] border bg-white p-2 text-xs outline-none focus:border-[#3E5730] ${
                  errors.expiry
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />

              {errors.expiry && (
                <p className="text-xs text-red-500">
                  {errors.expiry}
                </p>
              )}
            </div>

            {/* CVV */}
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
                inputMode="numeric"
                maxLength={3}
                placeholder="123"
                className={`w-full rounded-[8px] border bg-white p-2 text-xs outline-none focus:border-[#3E5730] ${
                  errors.cvv
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />

              {errors.cvv && (
                <p className="text-xs text-red-500">
                  {errors.cvv}
                </p>
              )}
            </div>

          </div>

          {/* Save card */}
          <label className="flex gap-[8px]">
            <input
              type="checkbox"
              defaultChecked
              className="mt-[3px] accent-[#3E5730]"
            />

            <span className="text-xs text-[#1F2937]">
              <span className="font-semibold">
                Save card for future checkout
              </span>

              <span className="mt-[4px] block text-xs text-gray-500">
                This card will be stored as your primary payment method
                for quicker grocery deliveries.
              </span>
            </span>
          </label>

        </div>

        {/* Buttons */}
        <div className="mt-[4px] flex items-center justify-end gap-[12px]">

          <button
            type="button"
            onClick={() => setCardDetailsOpen(false)}
            className="cursor-pointer rounded-[8px] border border-gray-300 px-[20px] py-[8px] text-xs font-semibold text-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateCard()) {
                onConfirmPayment();
              }
            }}
            className="flex cursor-pointer items-center justify-center rounded-[8px] bg-[#3E5730] px-[8px] py-[8px] text-xs font-semibold text-white"
          >
            Confirm payment method
          </button>

        </div>
      </div>
    </div>
  );
}
