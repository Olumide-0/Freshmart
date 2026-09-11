"use client";

import ApplePay from "../../assets/image/ApplePay.png";
import Mastercard from "../../assets/image/Mastercard.png";
import VisaLogo from "../../assets/image/visa-logo.png";
import GooglePay from "../../assets/image/GooglePay.png";

import { X, CreditCard } from "lucide-react";
import PaymentOption from "./PaymentOption";

export default function PaymentMethodModal({
    paymentOpen,
    setPaymentOpen,
    paymentMethod,
    setPaymentMethod,
    setCardDetailsOpen,
}) {
    if (!paymentOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-[20px]">
            <div className="relative w-full max-w-[380px] rounded-[12px] bg-white p-[24px]">

                {/* Cancel */}
                <button
                    type="button"
                    onClick={() => setPaymentOpen(false)}
                    className="absolute right-[20px] top-[20px] rounded-full p-[4px] text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                    <X size={20} />
                </button>

                <h2 className="text-[20px] font-extrabold text-[#1F2937]">
                    Payment Method
                </h2>

                <div className="mt-[24px] flex flex-col gap-[12px]">

                    {/* Credit / Debit Card */}
                    <button
                        type="button"
                        onClick={() => {
                            setPaymentMethod("Credit / Debit Card");
                            setPaymentOpen(false);
                            setCardDetailsOpen(true);
                        }}
                        className={`flex w-full items-center gap-2 rounded-[8px] border p-[14px] transition cursor-pointer ${paymentMethod === "Credit / Debit Card"
                                ? "border-[#3E5730] bg-[#F3F7F1]"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <CreditCard
                            size={24}
                            strokeWidth={1.8}
                            className="text-[#1F2937]"
                        />

                        <span className="text-[14px] font-semibold text-[#1F2937]">
                            Credit / Debit Card
                        </span>
                    </button>

                    {/* Visa */}
                    <PaymentOption
                        name="Visa"
                        image={VisaLogo}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {/* Google Pay */}
                    <PaymentOption
                        name="Google Pay"
                        image={GooglePay}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {/* Mastercard */}
                    <PaymentOption
                        name="Mastercard"
                        image={Mastercard}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                    {/* Apple Pay */}
                    <PaymentOption
                        name="Apple Pay"
                        image={ApplePay}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                </div>

                {/* Confirm */}
                <button
                    type="button"
                    onClick={() => setPaymentOpen(false)}
                    className="mt-[24px] w-full rounded-[8px] bg-[#3E5730] py-[12px] text-[14px] font-semibold text-white"
                >
                    Confirm Payment Method
                </button>

            </div>
        </div>
    );
}