import eggs from "../assets/image/image 61.png"; // placeholder — swap for real free-range eggs photo
import yogurt from "../assets/image/Frame 92 (1).png";
import sourdough from "../assets/image/ImageContainer.png";
import avocado from "../assets/image/image 112.png";
import orangeJuice from "../assets/image/image 55.png";
import carrot from "../assets/image/ImageContainer (2).png";
import croissant from "../assets/image/ImageContainer.png";
import strawberries from "../assets/image/image 110.png";
import milk from "../assets/image/Frame 92.png";
import almondButter from "../assets/image/image 109.png";
import mango from "../assets/image/image 111.png";
import coffee from "../assets/image/image 133.png";
import broccoli from "../assets/image/Frame 88.png";

import healthy from "../assets/image/Frame 102.png";
import mexican from "../assets/image/Frame 103.png";
import seasonal from "../assets/image/Frame 107.png";
import party from "../assets/image/image 133.png";
import school from "../assets/image/image 61.png";
import bbq from "../assets/image/image 134.png";

const RAW_OCCASION_PRODUCTS = [
  // ---------- Breakfast (15) ----------
  { occasion: "breakfast", image: eggs, name: "Free-Range Eggs", price: "42", cta: "cart" },
  { occasion: "breakfast", image: yogurt, name: "Organic Greek Yog...", price: "42", cta: "cart" },
  { occasion: "breakfast", image: sourdough, name: "Sourdough Bread", badge: "In season", price: "42", cta: "cart" },
  { occasion: "breakfast", image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { occasion: "breakfast", image: orangeJuice, name: "Fresh Orange Juice", price: "42", cta: "cart" },
  { occasion: "breakfast", image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { occasion: "breakfast", image: carrot, name: "Carrot", badge: "4 pieces left", price: "42", cta: "cart" },
  { occasion: "breakfast", image: croissant, name: "Croissants (4-Pack)", price: "42", cta: "cart" },
  { occasion: "breakfast", image: strawberries, name: "Fresh Strawberries", badge: "Low in stock", price: "42", cta: "cart" },
  { occasion: "breakfast", image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { occasion: "breakfast", image: milk, name: "Whole Organic Milk", badge: "Off the shelf", price: "42", cta: "cart" },
  { occasion: "breakfast", image: almondButter, name: "Creamy Almond Bu...", price: "42", cta: "cart" },
  { occasion: "breakfast", image: mango, name: "Fresh Mango", price: "42", cta: "cart" },
  { occasion: "breakfast", image: coffee, name: "Ground Arabica Co...", badge: "In season", price: "42", cta: "cart" },
  { occasion: "breakfast", image: broccoli, name: "Broccoli", price: "42", cta: "cart" },

  // ---------- Healthy living (15) ----------
  ...Array.from({ length: 15 }, (_, i) => ({
    occasion: "healthy-living",
    image: healthy,
    name: `Healthy Living Item ${i + 1}`,
    price: "42",
    cta: "cart",
  })),

  // ---------- Mexican Favourites (15) ----------
  ...Array.from({ length: 15 }, (_, i) => ({
    occasion: "mexican-favourites",
    image: mexican,
    name: `Mexican Favourite ${i + 1}`,
    price: "42",
    cta: "cart",
  })),

  // ---------- Seasonal Specials (15) ----------
  ...Array.from({ length: 15 }, (_, i) => ({
    occasion: "seasonal-specials",
    image: seasonal,
    name: `Seasonal Special ${i + 1}`,
    price: "42",
    cta: "cart",
  })),

  // ---------- Party essentials (15) ----------
  ...Array.from({ length: 15 }, (_, i) => ({
    occasion: "party-essentials",
    image: party,
    name: `Party Essential ${i + 1}`,
    price: "42",
    cta: "cart",
  })),

  // ---------- Back to school (15) ----------
  ...Array.from({ length: 15 }, (_, i) => ({
    occasion: "back-to-school",
    image: school,
    name: `Back to School Item ${i + 1}`,
    price: "42",
    cta: "cart",
  })),

  // ---------- BBQ & Grills (15) ----------
  ...Array.from({ length: 15 }, (_, i) => ({
    occasion: "bbq-grills",
    image: bbq,
    name: `BBQ & Grills Item ${i + 1}`,
    price: "42",
    cta: "cart",
  })),
];

// Auto-generate a unique slug per item (name + index, so duplicate names still get distinct URLs)
export const OCCASION_PRODUCTS = RAW_OCCASION_PRODUCTS.map((p, i) => ({
  ...p,
  slug: `${p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`,
}));