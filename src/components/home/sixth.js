import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import farm from "../../assets/image/Group 50.png";
import cook from "../../assets/image/image 91.png";

export default function Sixth() {
    return (
        <section className="w-full bg-[#F6F0E3] px-[20px] py-[24px] sm:px-[40px] sm:py-[28px] md:px-[64px] md:py-[32px] lg:py-[40px]  xl:py-[48px]">
            <div className="flex flex-col gap-[16px] bg-white p-[16px] rounded-[8px] sm:p-[20px] lg:flex-row lg:gap-[22px] lg:p-[22px]">
                {/* Left: From local farms to your table — full-bleed photo, text overlaid */}
                <div className="w-full lg:w-[60%]">
                    <div className="w-full relative overflow-hidden rounded-[16px]">
                    <Image
                        src={farm}
                        alt="Local farmer with fresh produce"
                        className="h-[220px] w-full object-cover sm:h-[260px] md:h-[290px] lg:h-[324px]"
                    />

                    <div className="absolute bottom-8 z-10 flex max-w-[80%] flex-col justify-center gap-[10px] px-[20px] sm:bottom-10 sm:max-w-[260px] sm:gap-[12px] sm:px-[24px] lg:bottom-14 lg:max-w-[280px] lg:gap-[14px] lg:px-[32px]">
                        <h2 className="text-[16px] font-extrabold leading-[1.25] text-[#1F2937] sm:text-[18px] md:text-[20px] lg:text-[22px]">
                            From local farms
                            <br />
                            to your table
                        </h2>
                        <p className="text-[11px] leading-[1.6] text-[#4B5563] sm:text-[12px] lg:text-[13px]">
                            we work directly with local farmers who share our commitment to
                            quality and sustainability
                        </p>
                        <Link
                            href="#"
                            className="flex items-center gap-[8px] text-[12px] font-semibold text-[#C6672E] sm:text-[13px] lg:text-[14px]"
                        >
                            Meet our farmers
                            <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
                </div>

                {/* Right: Cook something great tonight */}
                <div className="w-full lg:w-[40%]">
                    <div className="w-full relative overflow-hidden rounded-[16px]">
                    <Image
                        src={cook}
                        alt="Bowl of pasta with fork"
                        className="h-[220px] w-full object-cover sm:h-[260px] md:h-[290px] lg:h-[324px]"
                    />

                    <div className="absolute top-4 z-10 flex h-full max-w-[80%] flex-col justify-center gap-[10px] px-[20px] sm:top-5 sm:max-w-[260px] sm:gap-[12px] sm:px-[24px] lg:top-6 lg:max-w-[280px] lg:gap-[14px] lg:px-[32px]">
                        <h2 className="text-[16px] font-extrabold leading-[1.25] text-[#1F2937] sm:text-[18px] md:text-[20px] lg:text-[22px]">
                            Cook something
                            <br />
                            great tonight
                        </h2>
                        <p className="text-[11px] leading-[1.6] text-[#4B5563] sm:text-[12px] lg:text-[13px]">
                            Lorem ipsum dolor sit amet consectetur. Purus purus in erat
                            risus urna accumsan ut. Libero vestibulum.
                        </p>
                        <Link
                            href="#"
                            className="flex items-center gap-[8px] text-[12px] font-semibold text-[#C6672E] sm:text-[13px] lg:text-[14px]"
                        >
                            Explore recipes
                            <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
                </div>
            </div>
        </section>
    )
}