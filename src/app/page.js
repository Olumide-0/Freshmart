import Fifth from "@/components/home/fifth";
import Fourth from "@/components/home/fourth";
import Hero from "@/components/home/hero";
import Popular from "@/components/home/popular";
import Second from "@/components/home/second";
import Sixth from "@/components/home/sixth";
import Third from "@/components/home/third";
import { getProducts } from "@/lib/products";

export default async function Home() {
  // If the API is down the home page still renders; the popular cards are just empty.
  let popular = [];
  try {
    popular = await getProducts({ collection: "popular" });
  } catch (error) {
    console.error("Could not load popular products:", error);
  }

  return (
   <div>
    <Hero/>
    <Second/>
    <Third/>
    <Popular products={popular}/>
    <Fourth/>
    <Sixth/>
    <Fifth/>
   </div>
  );
}
