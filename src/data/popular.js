import avocado from "../assets/image/image 67.png";
import milk from "../assets/image/image 71.png";
import chicken from "../assets/image/image 73.png";

const RAW_POPULAR = [
  { name: "Organic Avocado", weight: "1g", rating: 4.9, reviews: 312, price: "$42", image: avocado, liked: false },
  { name: "Organic Milk", weight: "1g", rating: 4.9, reviews: 312, price: "$50", image: milk, liked: true },
  { name: "Organic Avocado", weight: "1g", rating: 4.9, reviews: 312, price: "$250", image: chicken, liked: false },
];

export const POPULAR = RAW_POPULAR.map((p, i) => ({
  ...p,
  slug: `${p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`,
}));