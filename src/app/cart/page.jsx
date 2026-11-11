import { getProducts } from "@/lib/products";
import CartView from "@/components/cart/CartView";

export default async function CartPage() {
  // "You may also like" is optional: if the API is down the cart still works,
  // the section is just hidden.
  let relatedProducts = [];
  try {
    relatedProducts = await getProducts({ collection: "cart-related" });
  } catch (error) {
    console.error("Could not load cart-related products:", error);
  }

  return <CartView relatedProducts={relatedProducts} />;
}
