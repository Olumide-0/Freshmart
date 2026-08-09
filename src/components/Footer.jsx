import Image from "next/image";
import logo from "../assets/image/fresh mart logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F6F0E3] px-[120px] pt-[64px] pb-[40px]">
      <div className="flex justify-between">
        {/* Logo + tagline */}
        <div className="max-w-[320px]">
          <Image src={logo} alt="FreshMart" className="h-[59px] w-[87px]" />
          <p className="mt-[16px] text-[16px] leading-[1.5] text-[#1F2937]">
            Better food, better living. Delivered with care
          </p>
        </div>

        {/* Link columns */}
        <div className="flex gap-[100px]">
          <div>
            <p className="text-[17px] font-bold text-[#1F2937]">Shop</p>
            <ul className="mt-[20px] flex flex-col gap-[16px]">
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Fresh produce
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Bakery
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Meat & seafood
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Dairy & eggs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[17px] font-bold text-[#1F2937]">Company</p>
            <ul className="mt-[20px] flex flex-col gap-[16px]">
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Local producers
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[17px] font-bold text-[#1F2937]">Support</p>
            <ul className="mt-[20px] flex flex-col gap-[16px]">
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Delivery areas
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[17px] font-bold text-[#1F2937]">Legal</p>
            <ul className="mt-[20px] flex flex-col gap-[16px]">
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[16px] text-[#1F2937]/85 hover:text-[#1F2937]">
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-[52px] border-t border-[#DED4C0]" />

      <p className="mt-[24px] text-[15px] text-[#8F8A80]">
        @ 2026 FreshMart. All rights reserved.
      </p>
    </footer>
  );
}