import avocado from "../assets/image/image 67.png";
import milk from "../assets/image/image 71.png";
import chicken from "../assets/image/image 73.png";
import carrot from "../assets/image/ImageContainer (2).png";
import cabbage from "../assets/image/ImageContainer (1).png";
import tomatoes from "../assets/image/image 110.png";
import mango from "../assets/image/image 111.png";
import broccoli from "../assets/image/Frame 88.png";

const RAW_POPULAR_WEEK = [
  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: milk, name: "Milk", price: "42", cta: "cart" },
  { image: chicken, name: "Fresh Chicken wings", price: "42", cta: "cart" },
  { image: chicken, name: "Shrimps", badge: "Low in stock", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },

  { image: carrot, name: "Carrot", badge: "Low in stock", price: "42", cta: "cart" },
  { image: cabbage, name: "Cabbage", price: "42", cta: "cart" },
  { image: tomatoes, name: "Tomatoes", badge: "In season", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },

  { image: tomatoes, name: "Tomatoes", badge: "Low in stock", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { image: mango, name: "Fresh Mango", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: broccoli, name: "Broccoli", badge: "In season", price: "42", cta: "cart" },
];

export const POPULAR_WEEK = RAW_POPULAR_WEEK.map((p, i) => ({
  ...p,
  slug: `${p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`,
}));