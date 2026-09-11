export default function PaymentProcessing({ paymentProcessing }) {
  if (!paymentProcessing) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center rounded-[12px] bg-white px-[40px] py-[32px]">
        <div className="h-[60px] w-[60px] animate-spin rounded-full border-[6px] border-gray-200 border-t-[#3E5730]" />

        <h2 className="mt-[20px] text-[18px] font-bold text-[#1F2937]">
          Processing your payment...
        </h2>

        <p className="mt-[8px] text-[13px] text-gray-500">
          Please wait while we confirm your payment.
        </p>
      </div>
    </div>
  );
}