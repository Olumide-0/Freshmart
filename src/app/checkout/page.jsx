"use client";


import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useState , useRef} from "react";

import { Check, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";



import DeliveryForm from "@/components/checkout/DeliveryForm";
import BasketSummary from "@/components/cart/BasketSummary";
import PaymentMethodModal from "@/components/checkout/PaymentMethodModal";
import CardDetailsModal from "@/components/checkout/CardDetailsModal";
import PaymentProcessing from "@/components/checkout/PaymentProcessing";



const steps = [
  { label: "Cart", state: "done" },
  { label: "Delivery", state: "done" },
  { label: "Payment", state: "" },
  { label: "Confirmation", state: "" },
];


export default function CheckoutPage() {

  const router = useRouter();

const items = useCartStore((state) => state.items);
const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalWeight = items.reduce(
  (total, item) => total + item.quantity * 6,
  0
);

const deliveryFormRef = useRef(null);

// const [deliveryData, setDeliveryData] = useState({});
// const [paymentMethod, setPaymentMethod] = useState("");
const deliveryData = useOrderStore((state) => state.deliveryData);
const setDeliveryData = useOrderStore((state) => state.setDeliveryData);

const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
const setDeliveryFee = useOrderStore((state) => state.setDeliveryFee);  
const setOrderItems = useOrderStore((state) => state.setOrderItems);
const setOrderSubtotal = useOrderStore(
  (state) => state.setOrderSubtotal
);
const setOrderTotalWeight = useOrderStore(
  (state) => state.setOrderTotalWeight
);

const paymentMethod = useOrderStore((state) => state.paymentMethod);
const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);

const [paymentOpen, setPaymentOpen] = useState(false);
const [cardDetailsOpen, setCardDetailsOpen] = useState(false);  
const [paymentProcessing, setPaymentProcessing] = useState(false);



const handleConfirmPayment = () => {
  setCardDetailsOpen(false);
  setPaymentProcessing(true);

  const orderNumber = `FM-${Math.floor(1000000 + Math.random() * 9000000)}`;

  setOrderNumber(orderNumber);
  setDeliveryFee(deliveryFee);

  setOrderItems(items);
  setOrderSubtotal(subtotal);
  setOrderTotalWeight(totalWeight);

  clearCart();

  setTimeout(() => {
    router.push("/confirmation");
  }, 2000);
};
const deliveryFee = 0;
const tax = 0;

  return (
    <div className="w-full bg-[#F6F0E3] px-[20px] py-[24px] sm:px-[40px] sm:py-[28px] md:px-[64px] md:py-[32px] xl:px-[80px] xl:py-[50px]">

      {/* Breadcrumb */}
   <div className="flex items-center gap-[6px] text-[12px] text-gray-500 sm:text-[13px]">
           <Link href="/" className="hover:text-gray-700">
             Home
           </Link>
   
           <span className="text-[#C6672E]">&gt;</span>
   
            <Link href="/cart" className="hover:text-gray-700">
             Cart
           </Link>

           <span className="text-[#C6672E]">&gt;</span>

           <span className="font-semibold text-[#1F2937]">
             Checkout
           </span>
         </div>

    
      {/* Heading */}
      <h1 className="mt-[16px] text-[24px] font-extrabold text-[#1F2937]">
        Secure Checkout
      </h1>

             {/* Stepper */}
        <ol className="mt-6 flex items-center">
          {steps.map((step, i) => (
            <li
              key={step.label}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-medium ${
                    step.state === "done" || step.state === "current"
                      ? "bg-[#2F5D3A] text-white"
                      : "border border-neutral-300 text-neut]ral-400"
                     
                  }`}
                >
                  {step.state === "done" ? (
                    <Check
                      className="h-3.5 w-3.5"
                      strokeWidth={3}
                    />
                  ) : (
                    i + 1
                  )}
                </span>

                <span
                  className={`whitespace-nowrap text-sm ${
                    step.state === "current"
                      ? "font-medium text-neutral-900"
                      : "text-neutral-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <span className="mx-3 h-px flex-1 border-t border-dashed border-neutral-300" />
              )}
            </li>
          ))}
        </ol>

      {/* Main checkout section */}
      <div className="mt-[20px] flex flex-col gap-[24px] lg:flex-row">

        {/* Delivery form */}
        <div className="w-full flex-1">
         <DeliveryForm
    ref={deliveryFormRef}
    onFormChange={setDeliveryData}
    paymentMethod={paymentMethod}
    setPaymentMethod={setPaymentMethod}
    setPaymentOpen={setPaymentOpen}
/>
        </div>

        {/* Basket summary */}
        <div className="w-full lg:w-[380px]">
          <BasketSummary
            subtotal={subtotal}
            totalWeight={totalWeight}
            isCheckout={true}
            deliveryFee={deliveryFee}
            tax={tax}
          onContinueToPayment={() => {
    if (deliveryFormRef.current?.validateForm()) {
        setPaymentOpen(true);
    }
}}
          />

        </div>

      
      </div>
    <PaymentMethodModal
  paymentOpen={paymentOpen}
  setPaymentOpen={setPaymentOpen}
  paymentMethod={paymentMethod}
  setPaymentMethod={setPaymentMethod}
   setCardDetailsOpen={setCardDetailsOpen}
/>

<CardDetailsModal
  cardDetailsOpen={cardDetailsOpen}
  setCardDetailsOpen={setCardDetailsOpen}
  onConfirmPayment={handleConfirmPayment}
/>
<PaymentProcessing paymentProcessing={paymentProcessing} />
    </div>
  );
}