import Image from "next/image";
import logo from "../assets/image/fresh mart logo.png";

export default function Footer() {
  return (
    <footer
      className="
        w-full bg-[#F6F0E3]
        px-[20px] pt-[40px] pb-[30px]
        sm:px-[32px] sm:pt-[48px] sm:pb-[32px]
        md:px-[60px] md:pt-[56px]
       lg:pt-[64px] lg:pb-[40px]
        
      "
    >
      <div
        className="
          flex flex-col gap-[40px]
          lg:flex-row lg:justify-between lg:gap-[60px]
        "
      >
        {/* Logo + tagline */}
        <div className="max-w-[320px]">
          <Image
            src={logo}
            alt="FreshMart"
            className="h-[50px] w-[74px] sm:h-[59px] sm:w-[87px]"
          />

          <p
            className="
              mt-[14px]
              text-[14px] leading-[1.5]
              text-[#1F2937]
              sm:mt-[16px] sm:text-[16px]
            "
          >
            Better food, better living. Delivered with care
          </p>
        </div>

        {/* Link columns */}
        <div
          className="
            grid grid-cols-2 gap-x-[40px] gap-y-[36px]
            sm:grid-cols-4 sm:gap-x-[32px] sm:gap-y-[40px]
            lg:gap-x-[60px]
            xl:gap-x-[100px]
          "
        >
          {/* Shop */}
          <div>
            <p className="text-[16px] font-bold text-[#1F2937] sm:text-[17px]">
              Shop
            </p>

            <ul className="mt-[16px] flex flex-col gap-[14px] sm:mt-[20px] sm:gap-[16px]">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Fresh produce
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Bakery
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Meat & seafood
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Dairy & eggs
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[16px] font-bold text-[#1F2937] sm:text-[17px]">
              Company
            </p>

            <ul className="mt-[16px] flex flex-col gap-[14px] sm:mt-[20px] sm:gap-[16px]">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  About us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Local producers
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Careers
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[16px] font-bold text-[#1F2937] sm:text-[17px]">
              Support
            </p>

            <ul className="mt-[16px] flex flex-col gap-[14px] sm:mt-[20px] sm:gap-[16px]">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Help center
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Delivery areas
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[16px] font-bold text-[#1F2937] sm:text-[17px]">
              Legal
            </p>

            <ul className="mt-[16px] flex flex-col gap-[14px] sm:mt-[20px] sm:gap-[16px]">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Terms of service
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Privacy policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#1F2937]/85 hover:text-[#1F2937] sm:text-[16px]"
                >
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-[40px] border-t border-[#DED4C0] sm:mt-[52px]" />

      {/* Copyright */}
      <p className="mt-[20px] text-[13px] text-[#8F8A80] sm:mt-[24px] sm:text-[15px]">
        @ 2026 FreshMart. All rights reserved.
      </p>
    </footer>
  );
}

