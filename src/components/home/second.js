"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import bakery from "../../assets/image/Frame 88.png";
import frozen from "../../assets/image/Frame 89.png";
import meat from "../../assets/image/Frame 90.png";
import dairy from "../../assets/image/Frame 91.png";
import produce from "../../assets/image/Frame 92.png";
import orange from "../../assets/image/image 55.png";
import cucumber from "../../assets/image/image 85.png";
import snacks from "../../assets/image/Frame 94.png";
import { ArrowRight, X, ChevronRight } from "lucide-react";

const DEPARTMENTS = [
  { label: "Fresh Produce", slug: "fresh-produce", image: produce },
  { label: "Bakery", slug: "bakery", image: bakery },
  { label: "Frozen Foods", slug: "frozen-foods", image: frozen },
  { label: "Meat & Sea Foods", slug: "meat-seafood", image: meat },
  { label: "Dairy & Eggs", slug: "dairy-eggs", image: dairy },
];

const ALL_CATEGORIES = [
  { label: "Fresh Produce", slug: "fresh-produce", image: produce },
  { label: "Bakery", slug: "bakery", image: bakery },
  { label: "Frozen foods", slug: "frozen-foods", image: frozen },
  { label: "Meat & seafood", slug: "meat-seafood", image: meat },
  { label: "Dairy & Eggs", slug: "dairy-eggs", image: dairy },
  { label: "Beverages", slug: "beverages", image: orange },
  { label: "Fruits", slug: "fruits", image: cucumber },
  { label: "Snacks", slug: "snacks", image: snacks },
];

 
export default function Second() { 
  const [open, setOpen] = useState(false); 
 
  return ( 
    <div className="w-full  bg-[#F6F0E3] -mt-10 px-[20px] py-[36px] sm:px-[40px] sm:py-[44px] md:px-[64px] md:py-[56px]  xl:py-[68px]"> 
      <div className="flex relative z-[60] items-center justify-between"> 
        <h2 className="text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] lg:text-[26px]"> 
          Shop by Department 
        </h2> 
        <button 
          onClick={() => setOpen(true)} 
          className="flex items-center gap-2 text-[14px]  font-semibold text-[#3E5730] sm:text-[15px] lg:text-[16px] cursor-pointer" 
        > 
          View All 
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" /> 
        </button> 
      </div> 
 
      <div className="mt-[20px] grid grid-cols-2 gap-[12px] sm:mt-[24px] sm:grid-cols-3 sm:gap-[16px] md:grid-cols-4 lg:grid-cols-5 lg:gap-[22px] xl:mt-[28px]"> 
        {DEPARTMENTS.map(({ label, slug, image }) => ( 
          <Link key={label} href={`/products/${slug}`}> 
            <Image 
              src={image} 
              alt={label} 
              className="h-auto w-full rounded-[8px] border border-[#E4A94CD9]" 
            /> 
          </Link> 
        ))} 
      </div> 
 
      {/* Sidebar modal */} 
      <div 
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${ 
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0" 
        }`} 
      > 
        <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/45" /> 
 
        <div 
          className={`absolute right-0 top-0 mt-16 h-[85%] w-full max-w-[560px] transform rounded-tl-xl rounded-bl-xl bg-white px-[20px] py-[24px] shadow-2xl transition-transform duration-300 sm:px-[28px] sm:py-[28px] md:px-[40px] md:py-[36px] ${ 
            open ? "translate-x-0" : "translate-x-full" 
          }`} 
        > 
          <div className="flex items-center justify-between"> 
            <h2 className="text-[22px] font-extrabold text-[#1F2937] sm:text-[26px] md:text-[30px]">All Categories</h2> 
            <button onClick={() => setOpen(false)} aria-label="Close"> 
              <X className="h-[22px] w-[22px] text-[#1F2937] sm:h-[26px] sm:w-[26px]" strokeWidth={2} /> 
            </button> 
          </div> 
 
          <div className="mt-[20px] flex h-[calc(100%-90px)] flex-col gap-[12px] overflow-y-auto pr-[10px] sm:mt-[24px] sm:gap-[16px] md:mt-[28px]"> 
            {ALL_CATEGORIES.map(({ label, slug, image }) => ( 
              <Link 
                key={label} 
                href={`/products/${slug}`} 
                onClick={() => setOpen(false)} 
                className="flex items-center gap-[12px] rounded-2xl border border-[#F0D2A8] bg-white p-[10px] sm:gap-[16px]" 
              > 
                <Image 
                  src={image} 
                  alt={label} 
                  className="h-[60px] w-[80px] shrink-0 rounded-xl object-cover sm:h-[72px] sm:w-[96px]" 
                /> 
                <span className="flex-1 text-[15px] font-bold text-[#1F2937] sm:text-[17px]">{label}</span> 
                <ChevronRight className="h-[20px] w-[20px] shrink-0 text-[#1F2937]" strokeWidth={2.5} /> 
              </Link> 
            ))} 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}