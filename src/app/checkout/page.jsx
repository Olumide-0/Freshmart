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
import PaymentProcessing from "@/components/checkout/PaymentProcessing";
import { cartTotalWeightKg } from "@/lib/cart";



// New reference per payment attempt; also used as the order number.
const generateReference = () =>
  `FM-${Math.floor(1000000 + Math.random() * 9000000)}`;

// Read the clock in a module-level helper (same reason as generateReference).
const getOrderTimestamp = () => Date.now();

const steps = [
  { label: "Cart", state: "done" },
  { label: "Delivery", state: "done" },
  { label: "Payment", state: "current" },
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
  const totalWeight = cartTotalWeightKg(items);

const deliveryFormRef = useRef(null);

// const [deliveryData, setDeliveryData] = useState({});
// const [paymentMethod, setPaymentMethod] = useState("");
const deliveryData = useOrderStore((state) => state.deliveryData);
const setDeliveryData = useOrderStore((state) => state.setDeliveryData);

const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
const setOrderPlacedAt = useOrderStore((state) => state.setOrderPlacedAt);
const setDeliveryFee = useOrderStore((state) => state.setDeliveryFee);  
const setOrderItems = useOrderStore((state) => state.setOrderItems);
const setOrderSubtotal = useOrderStore(
  (state) => state.setOrderSubtotal
);
const setOrderTotalWeight = useOrderStore(
  (state) => state.setOrderTotalWeight
);
const tip = useOrderStore((state) => state.tip);
const setTip = useOrderStore((state) => state.setTip);
const setOrderTip = useOrderStore((state) => state.setOrderTip);

const paymentMethod = useOrderStore((state) => state.paymentMethod);
const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);

const [paymentOpen, setPaymentOpen] = useState(false);
const [paymentProcessing, setPaymentProcessing] = useState(false);



const handleConfirmPayment = (orderNumber) => {
  setPaymentProcessing(true);

  setOrderNumber(orderNumber);
  setOrderPlacedAt(getOrderTimestamp());
  setDeliveryFee(deliveryFee);

  setOrderItems(items);
  setOrderSubtotal(subtotal);
  setOrderTotalWeight(totalWeight);
  setOrderTip(tip);

  // Demo receipt email: fire-and-forget (not awaited) so a failed email never
  // delays or breaks the processing modal or the redirect.
  fetch("/api/send-receipt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderNumber,
      email: deliveryData.email,
      customerName: deliveryData.fullName,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      deliveryFee,
      tax,
      tip,
      total: subtotal + deliveryFee + tax + tip,
      address1: deliveryData.address1,
      address2: deliveryData.address2,
      city: deliveryData.city,
      postalCode: deliveryData.postalCode,
      deliveryTime: deliveryData.deliveryTime,
      paymentMethod,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`Receipt email was not sent (HTTP ${res.status}).`);
      }
    })
    .catch((error) => {
      console.error("Receipt email request failed:", error);
    });

  clearCart();
  setTip(0);

  setTimeout(() => {
    router.push("/confirmation");
  }, 2000);
};

const handlePaystackPayment = async () => {
  const total = subtotal + deliveryFee + tax + tip;

  if (items.length === 0 || total <= 0) {
    console.error("Paystack: not opening checkout, the order total is 0.");
    return;
  }

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error(
      "Paystack: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set. Add your pk_test_ key to .env.local and restart the dev server."
    );
    return;
  }

  const reference = generateReference();

  // Loaded on demand so the library only ever runs in the browser.
  const { default: PaystackPop } = await import("@paystack/inline-js");
  const popup = new PaystackPop();

  popup.newTransaction({
    key: publicKey,
    email: deliveryData.email,
    // DEMO WORKAROUND: prices are in MXN, but Paystack doesn't support MXN,
    // so the same numeric total is charged as NGN (in kobo). A real Mexico
    // launch needs a payment processor that supports MXN.
    amount: Math.round(total * 100),
    currency: "NGN",
    reference,
    onSuccess: (transaction) => {
      // NOT VERIFIED: this callback only means the popup reported success.
      // Once a backend exists, verify transaction.reference server-side with
      // the secret key via Paystack's verify endpoint
      // (GET https://api.paystack.co/transaction/verify/:reference)
      // before treating the order as paid.
      handleConfirmPayment(transaction.reference || reference);
    },
    // Customer closed the popup: keep cart and form as they are.
    onCancel: () => {},
    onError: (error) => {
      console.error("Paystack: checkout failed to load.", error?.message);
    },
  });
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
                      : "border border-neutral-300 text-neutral-400"
                     
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
            isPaymentDisabled={items.length === 0}
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
   onConfirmPaymentMethod={handlePaystackPayment}
/>

<PaymentProcessing paymentProcessing={paymentProcessing} />
    </div>
  );
}