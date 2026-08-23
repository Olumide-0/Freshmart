import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import farm from "../../assets/image/Group 50.png";
import cook from "../../assets/image/image 91.png";

export default function Sixth() {
    return (
        <section className="w-full bg-[#F6F0E3] px-[172px] py-[48px]">
            <div className="flex gap-[22px] bg-white p-[22px] rounded-[8px]">
                {/* Left: From local farms to your table — full-bleed photo, text overlaid */}
                <div className="w-[60%]">
                    <div className="w-full relative overflow-hidden rounded-[16px]">
                    <Image
                        src={farm}
                        alt="Local farmer with fresh produce"
                        className="h-[324px] w-full"
                    />

                    <div className="absolute bottom-14 z-10 flex max-w-[280px] flex-col justify-center gap-[14px] px-[32px]">
                        <h2 className="text-[22px] font-extrabold leading-[1.25] text-[#1F2937]">
                            From local farms
                            <br />
                            to your table
                        </h2>
                        <p className="text-[13px] leading-[1.6] text-[#4B5563]">
                            we work directly with local farmers who share our commitment to
                            quality and sustainability
                        </p>
                        <Link
                            href="#"
                            className="flex items-center gap-[8px] text-[14px] font-semibold text-[#C6672E]"
                        >
                            Meet our farmers
                            <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
                </div>

                {/* Right: Cook something great tonight */}
                <div className="w-[40%]">
                    <div className="w-full relative overflow-hidden rounded-[16px]">
                    <Image
                        src={cook}
                        alt="Bowl of pasta with fork"
                        className="h-[324px] w-full"
                    />

                    <div className="absolute top-6 z-10 flex h-full max-w-[280px] flex-col justify-center gap-[14px] px-[32px]">
                        <h2 className="text-[22px] font-extrabold leading-[1.25] text-[#1F2937]">
                            Cook something
                            <br />
                            great tonight
                        </h2>
                        <p className="text-[13px] leading-[1.6] text-[#4B5563]">
                            Lorem ipsum dolor sit amet consectetur. Purus purus in erat
                            risus urna accumsan ut. Libero vestibulum.
                        </p>
                        <Link
                            href="#"
                            className="flex items-center gap-[8px] text-[14px] font-semibold text-[#C6672E]"
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