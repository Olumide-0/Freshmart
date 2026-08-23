import chicken from "../assets/image/image 73.png";
import milk from "../assets/image/image 71.png";
import oranges from "../assets/image/image 191.png"
import sinamon from "../assets/image/ImageContainer.png"
import pepper from "../assets/image/image 109.png"
import tomatoes from "../assets/image/image 110.png"
import mangoe from "../assets/image/image 111.png"
import avocado from "../assets/image/image 112.png"
import wings from "../assets/image/image 118.png"
import watermelon from "../assets/image/image 182.png"
import apples from "../assets/image/image 185.png"
import bellpepper from "../assets/image/image 189.png"
import cabbage from "../assets/image/ImageContainer (1).png"
import donut from "../assets/image/ImageContainer (2).png"

const RAW_GROCERIES = [
  { image: watermelon, name: "Watermelon", badge: null, price: "42", cta: "cart" },
  { image: mangoe, name: "Fresh Mango", badge: null, price: "42", cta: "cart" },
  { image: wings, name: "Fresh Chicken wings", badge: null, price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", badge: null, price: "42", cta: "cart" },
  { image: bellpepper, name: "Bell pepper", badge: null, price: "42", cta: "add" },

  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: cabbage, name: "Cabbage", badge: null, price: "42", cta: "cart" },
  { image: tomatoes, name: "Tomatoes", badge: "In season", price: "42", cta: "cart" },
  { image: chicken, name: "Shrimps", badge: "Low in stock", price: "42", cta: "cart" },
  { image: pepper, name: "Organic Avocado", badge: null, price: "42", cta: "cart" },

  { image: donut, name: "Carrot", badge: "Off season", price: "42", cta: "cart" },
  { image: milk, name: "Milk", badge: null, price: "42", cta: "cart" },
  { image: apples, name: "Organic Apples", badge: null, price: "42", cta: "add" },
  { image: oranges, name: "Oranges", badge: "In season", price: "42", cta: "cart" },
  { image: sinamon, name: "Organic Avocado", badge: null, price: "42", cta: "cart" },
];

// Auto-generate a unique slug per grocery item (name + index, so duplicate names
// like "Organic Avocado" still get distinct URLs)
export const GROCERIES = RAW_GROCERIES.map((p, i) => ({
  ...p,
  slug: `${p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`,
}));