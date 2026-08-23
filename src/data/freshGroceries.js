import mango from "../assets/image/image 82.png";
import lettuce from "../assets/image/image 84.png";
import banana from "../assets/image/image 111.png";
import cucumber from "../assets/image/image 85 (1).png";
import blueberries from "../assets/image/image 87.png";
import strawberries from "../assets/image/image 110.png";
import watermelon from "../assets/image/image 182.png";
import oranges from "../assets/image/image 191.png";
import apples from "../assets/image/image 185.png";
import bellpepper from "../assets/image/image 189.png";
import corn from "../assets/image/Frame 90.png";
import avocado from "../assets/image/image 112.png";
import broccoli from "../assets/image/Frame 88.png";

const RAW_FRESH_GROCERIES = [
  { image: mango, name: "Sweet mangoes", badge: "In season", price: "42", cta: "cart" },
  { image: lettuce, name: "Lettuce", price: "42", cta: "cart" },
  { image: banana, name: "Banana", price: "42", cta: "cart" },
  { image: cucumber, name: "Cucumber", badge: "Low in stock", price: "42", cta: "cart" },
  { image: blueberries, name: "Blue berries", price: "42", cta: "cart" },

  { image: strawberries, name: "Strawberries", badge: "Low in stock", price: "42", cta: "cart" },
  { image: watermelon, name: "Watermelon", price: "42", cta: "cart" },
  { image: oranges, name: "Oranges", badge: "In season", price: "42", cta: "cart" },
  { image: apples, name: "Organic Apples", price: "42", cta: "add" },
  { image: bellpepper, name: "Bell pepper", price: "42", cta: "add" },

  { image: corn, name: "Tomatoes", badge: "Low in stock", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { image: mango, name: "Fresh Mango", price: "42", cta: "cart" },
  { image: avocado, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { image: broccoli, name: "Broccoli", badge: "In season", price: "42", cta: "cart" },
];

export const FRESH_GROCERIES = RAW_FRESH_GROCERIES.map((p, i) => ({
  ...p,
  slug: `${p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`,
}));