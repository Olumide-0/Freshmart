import Fifth from "@/components/home/fifth";
import Fourth from "@/components/home/fourth";
import Hero from "@/components/home/hero";
import Popular from "@/components/home/popular";
import Second from "@/components/home/second";
import Sixth from "@/components/home/sixth";
import Third from "@/components/home/third";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Hero/>
    <Second/>
    <Third/>
    <Popular/>
    <Fourth/>
    <Sixth/>
    <Fifth/>
   </div>
  );
}
