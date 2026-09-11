export default function PaymentOption({
  name,
  image,
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <button
      type="button"
      onClick={() => setPaymentMethod(name)}
      className={`flex w-full items-center justify-between rounded-[8px] border p-[14px] transition cursor-pointer ${
        paymentMethod === name
          ? "border-[#3E5730] bg-[#F3F7F1]"
          : "border-gray-200 bg-white"
      }`}
    >
      <img
        src={image.src}
        alt={name}
        className="h-[24px] w-auto object-contain"
      />
    </button>
  );
}