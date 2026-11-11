import Image from "next/image";

export default function PaymentOption({
  name,
  image,
  paymentMethod,
  setPaymentMethod,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={() => setPaymentMethod(name)}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-[8px] border p-[14px] transition ${
        disabled
          ? "cursor-not-allowed border-gray-200 bg-gray-50"
          : paymentMethod === name
          ? "cursor-pointer border-[#3E5730] bg-[#F3F7F1]"
          : "cursor-pointer border-gray-200 bg-white"
      }`}
    >
      <Image
        src={image}
        alt={name}
        className={`h-[24px] w-auto object-contain ${disabled ? "opacity-50 grayscale" : ""}`}
      />

      {disabled && (
        <span className="text-[12px] font-medium text-gray-500">
          Coming soon
        </span>
      )}
    </button>
  );
}