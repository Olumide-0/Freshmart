import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import ProductDetail from "@/components/products/ProductDetail";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  // key resets the gallery, size and quantity state when moving between products.
  return <ProductDetail key={product.id} product={product} />;
}
