"use client";

import { useImperativeHandle, useState, forwardRef } from "react";




import { ChevronDown, ChevronRight } from "lucide-react";

const DeliveryForm = forwardRef(function DeliveryForm(
    {
        onFormChange,
        paymentMethod,
        setPaymentMethod,
        setPaymentOpen,
    },
    ref
) {
    const [formData, setFormData] = useState({
        fullName: "",
        contactInfo: "",
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        deliveryTime: "Tomorrow 8:00 AM – 11:00 AM",
        instructions: "",
    });


    const [errors, setErrors] = useState({});


    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.contactInfo.trim()) {
            newErrors.contactInfo = "Email or phone number is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9+\-\s()]{7,}$/;

            if (
                !emailRegex.test(formData.contactInfo) &&
                !phoneRegex.test(formData.contactInfo)
            ) {
                newErrors.contactInfo = "Enter a valid email or phone number";
            }
        }

        if (!formData.address1.trim()) {
            newErrors.address1 = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

      const postalCodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;

if (!formData.postalCode.trim()) {
    newErrors.postalCode = "Postal code is required";
} else if (!postalCodeRegex.test(formData.postalCode.trim())) {
    newErrors.postalCode = "Enter a valid postal code";
}

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
    validateForm,
}));


    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...formData,
            [name]: value,
        };

        setFormData(updatedData);
        setErrors((prev) => ({
    ...prev,
    [name]: "",
}));
        onFormChange(updatedData);
    };

    return (
        <div className="flex flex-col gap-[16px]">

            {/* Delivery Details */}
            <div className="rounded-[8px] bg-white p-[20px] sm:p-[24px]">
                <h2 className="text-[18px] font-extrabold text-[#1F2937]">
                    Delivery Details
                </h2>

                <div className="mt-[20px] flex flex-col gap-[16px]">

                    {/* Full Name */}
                    <div className="flex flex-col gap-[6px]">
                        <label
                            htmlFor="fullName"
                            className="text-[14px] font-semibold text-[#1F2937]"
                        >
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full rounded-[8px] border border-gray-200 p-[12px] outline-none"
                        />
                        {errors.fullName && (
    <p className="text-sm text-red-500">{errors.fullName}</p>
)}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-[6px]">
                        <label
                            htmlFor="contactInfo"
                            className="text-[14px] font-semibold text-[#1F2937]"
                        >
                            Contact Info
                        </label>

                        <input
                            id="contactInfo"
                            type="text"
                            name="contactInfo"
                            placeholder="Phone number or email"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            className="w-full rounded-[8px] border border-gray-200 p-[12px] outline-none"
                        />
                        {errors.contactInfo && (
    <p className="text-sm text-red-500">{errors.contactInfo}</p>
)}
                    </div>

                    {/* Address Line 1 */}
                    <div className="flex flex-col gap-[6px]">
                        <label
                            htmlFor="address1"
                            className="text-[14px] font-semibold text-[#1F2937]"
                        >
                            Address line 1
                        </label>

                        <input
                            id="address1"
                            type="text"
                            name="address1"
                            placeholder="Street address"
                            value={formData.address1}
                            onChange={handleChange}
                            className="w-full rounded-[8px] border border-gray-200 p-[12px] outline-none"
                        />
                        {errors.address1 && (
    <p className="text-sm text-red-500">{errors.address1}</p>
)}
                    </div>

                    {/* Address Line 2 */}
                    <div className="flex flex-col gap-[6px]">
                        <label
                            htmlFor="address2"
                            className="text-[14px] font-semibold text-[#1F2937]"
                        >
                            Address line 2
                            <span className="ml-[4px] font-normal text-gray-500">
                                (optional)
                            </span>
                        </label>

                        <input
                            id="address2"
                            type="text"
                            name="address2"
                            placeholder="Apartment, suite, etc. (optional)"
                            value={formData.address2}
                            onChange={handleChange}
                            className="w-full rounded-[8px] border border-gray-200 p-[12px] outline-none"
                        />
                    </div>

                    {/* City + Postal Code */}
                    <div className="flex flex-col gap-[16px] sm:flex-row">
                        <div className="flex w-full flex-col gap-[6px]">
                            <label
                                htmlFor="city"
                                className="text-[14px] font-semibold text-[#1F2937]"
                            >
                                City
                            </label>

                            <input
                                id="city"
                                type="text"
                                name="city"
                                placeholder="Enter your city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full rounded-[8px] border border-gray-200 p-[12px] outline-none"
                            />
                            {errors.city && (
    <p className="text-sm text-red-500">{errors.city}</p>
)}
                        </div>

                        <div className="flex w-full flex-col gap-[6px]">
                            <label
                                htmlFor="postalCode"
                                className="text-[14px] font-semibold text-[#1F2937]"
                            >
                                Postal code / Zip
                            </label>

                            <input
                                id="postalCode"
                                type="text"
                                name="postalCode"
                                placeholder="Enter postal code"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full rounded-[8px] border border-gray-200 p-[12px] outline-none"
                            />
                            {errors.postalCode && (
    <p className="text-sm text-red-500">{errors.postalCode}</p>
)}
                        </div>
                    </div>

                    {/* Save address */}
                    <button
                        type="button"
                        className="self-end text-[14px] font-semibold text-white px-8 py-1 rounded bg-[#3E5730] cursor-pointer "
                    >
                        Save
                    </button>

                </div>
            </div>

            {/* Delivery Time */}
            <div className="rounded-[8px] bg-white p-[20px] sm:p-[24px]">
                <h2 className="text-[18px] font-extrabold text-[#1F2937]">
                    Preferred delivery time
                </h2>

                <div className="mt-[20px] flex flex-col gap-[12px]">
                    <label
                        htmlFor="deliveryTime"
                        className="text-[14px] font-semibold text-[#1F2937]"
                    >
                        Select an available window for our riders to deliver your fresh basket at peak quality.

                    </label>
                    <div className="relative">
                        <select
                            id="deliveryTime"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleChange}
                            className="h-[48px] w-full appearance-none rounded-[8px] border border-gray-200 bg-white px-[14px] pr-[44px] text-[14px] text-[#1F2937] outline-none focus:border-[#3E5730]"
                        >
                            <option
                                value="Today 2:00 PM – 4:00 PM"
                                className="rounded-[8px] bg-white text-[#1F2937] checked:bg-[#3E5730] checked:text-white"
                            >
                                Today 2:00 PM – 4:00 PM
                            </option>

                            <option
                                value="Tomorrow 8:00 AM – 11:00 AM"
                                className="rounded-[8px] bg-white text-[#1F2937] checked:bg-[#3E5730] checked:text-white"
                            >
                                Tomorrow 8:00 AM – 11:00 AM
                            </option>

                            <option
                                value="Tomorrow 4:00 PM – 7:00 PM"
                                className="rounded-[8px] bg-white text-[#1F2937] checked:bg-[#3E5730] checked:text-white"
                            >
                                Tomorrow 4:00 PM – 7:00 PM
                            </option>
                        </select>

                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-gray-500"
                        />
                    </div>
                </div>
            </div>
            <div className="rounded-[8px] bg-white p-[20px] sm:p-[24px]">
                <h2 className="text-[18px] font-extrabold text-[#1F2937]">
                    Delivery Instructions (optional)
                </h2>

                <div className="mt-[20px] flex flex-col gap-[12px]">
                    <label
                        htmlFor="deliveryTime"
                        className="text-[14px] font-semibold text-[#1F2937]"
                    >Notes for the driver
                    </label>

                    <textarea className="border-1 rounded border-gray-400 p-4 w-full"
                        id="instructions"
                        name="instructions"
                        rows="3"
                        onChange={handleChange}
                        value={formData.instructions}
                        placeholder="e.g. Ring bell twice, leave next to green flower pot on porch if not home...">
                    </textarea>

                </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-[8px] bg-white p-[20px] sm:p-[24px]">
                <h2 className="text-left text-[18px] font-extrabold text-[#1F2937]">
                    Payment Method
                </h2>

                <button
                    type="button"
                    onClick={() => {
                        if (validateForm()) {
                            setPaymentOpen(true);
                        }
                    }}
                    className="mt-[20px] flex w-full items-center justify-between rounded-[8px] border border-gray-200 bg-white px-[24px] py-[12px]"
                >
                    <p className="text-left text-[14px] text-gray-500">
                        {paymentMethod || "Add new payment method"}
                    </p>

                    <ChevronRight
                        size={20}
                        className="shrink-0 text-gray-500"
                    />
                </button>
            </div>


        </div>
    );
})

export default DeliveryForm;