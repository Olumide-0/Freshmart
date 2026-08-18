import mango from "../assets/image/image 111.png";
import tomatoes from "../assets/image/image 110.png";
import avocado from "../assets/image/image 112.png";
import pepper from "../assets/image/image 109.png";
import carrot from "../assets/image/ImageContainer (2).png";
import cabbage from "../assets/image/ImageContainer (1).png";
import sourdough from "../assets/image/ImageContainer.png";
import croissant from "../assets/image/ImageContainer.png";
import produceHero from "../assets/image/Frame 88.png";
import bakeryHero from "../assets/image/Frame 89.png";
import frozen from "../assets/image/Frame 90.png";
import meat from "../assets/image/Frame 91.png";
import dairy from "../assets/image/Frame 92.png";
import orange from "../assets/image/image 55.png";
import cucumber from "../assets/image/image 85.png";
import snacks from "../assets/image/Frame 94.png";
import produce from "../assets/image/Frame 92.png";
import carrot1 from "../assets/image/image 113.png"
import onions from "../assets/image/image 114 (1).png"

export const PRODUCTS = [
  // ---------- Fresh Produce (15) ----------
  { category: "fresh-produce", image: produce, name: "Broccoli", price: "42", cta: "cart" },
  { category: "fresh-produce", image: mango, name: "Fresh Mango", price: "42", cta: "cart" },
  { category: "fresh-produce", image: tomatoes, name: "Tomatoes", badge: "In season", price: "42", cta: "cart" },
  { category: "fresh-produce", image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "fresh-produce", image: pepper, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "fresh-produce", image: carrot1, name: "Carrot", badge: "Off season", price: "42", cta: "cart" },
  { category: "fresh-produce", image: onions, name: "Cabbage", price: "42", cta: "cart" },
  { category: "fresh-produce", image: tomatoes, name: "Tomatoes", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "fresh-produce", image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "fresh-produce", image: pepper, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "fresh-produce", image: tomatoes, name: "Tomatoes", badge: "Off season", price: "42", cta: "cart" },
  { category: "fresh-produce", image: avocado, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "fresh-produce", image: mango, name: "Fresh Mango", price: "42", cta: "cart" },
  { category: "fresh-produce", image: pepper, name: "Organic Avocado", badge: "In season", price: "42", cta: "cart" },
  { category: "fresh-produce", image: produceHero, name: "Broccoli", price: "42", cta: "cart" },

  // ---------- Bakery (15) ----------
  { category: "bakery", image: croissant, name: "Artisan Sourdough...", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Croissant (4-Pack)", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Chocolate Chip Co...", badge: "In season", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Carrot", badge: "Off season", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Cabbage", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Tomatoes", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "bakery", image: sourdough, name: "Artisan Sourdough...", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Croissant (4-Pack)", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Chocolate Chip Co...", badge: "In season", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Organic Avocado", price: "42", cta: "cart" },
  { category: "bakery", image: croissant, name: "Organic Avocado", price: "42", cta: "cart" },

  // ---------- Frozen Foods (15) ----------
  { category: "frozen-foods", image: frozen, name: "Frozen Vanilla Ice Cream", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Peas", badge: "In season", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Berries Mix", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Pizza", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Waffles", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Yogurt", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Corn", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Fries", badge: "Off season", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Dumplings", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Mixed Vegetables", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Chicken Nuggets", badge: "In season", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Spinach", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Fruit Popsicles", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Fish Fillet", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "frozen-foods", image: frozen, name: "Frozen Ice Cubes", price: "42", cta: "cart" },

  // ---------- Meat & Sea Foods (15) ----------
  { category: "meat-seafood", image: meat, name: "Salmon Fillet", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Beef Ribeye Steak", badge: "In season", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Chicken Breast", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Ground Beef", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Shrimp", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Lamb Chops", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Pork Chops", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Tuna Steak", badge: "Off season", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Turkey Breast", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Bacon Strips", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Crab Legs", badge: "In season", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Sausages", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Chicken Wings", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Cod Fillet", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "meat-seafood", image: meat, name: "Beef Brisket", price: "42", cta: "cart" },

  // ---------- Dairy & Eggs (15) ----------
  { category: "dairy-eggs", image: dairy, name: "Whole Milk", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Cheddar Cheese", badge: "In season", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Free-range Eggs", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Greek Yogurt", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Butter", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Mozzarella Cheese", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Cream Cheese", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Sour Cream", badge: "Off season", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Cottage Cheese", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Almond Milk", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Parmesan Cheese", badge: "In season", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Heavy Cream", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Feta Cheese", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Duck Eggs", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "dairy-eggs", image: dairy, name: "Chocolate Milk", price: "42", cta: "cart" },

  // ---------- Beverages (15) ----------
  { category: "beverages", image: orange, name: "Fresh Orange Juice", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Sparkling Water", badge: "In season", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Apple Juice", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Cold Brew Coffee", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Green Tea", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Lemonade", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Grape Juice", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Energy Drink", badge: "Off season", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Coconut Water", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Iced Tea", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Mineral Water", badge: "In season", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Smoothie Mix", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Cranberry Juice", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Root Beer", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "beverages", image: orange, name: "Pineapple Juice", price: "42", cta: "cart" },

  // ---------- Fruits (15) ----------
  { category: "fruits", image: cucumber, name: "Cucumber", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Green Grapes", badge: "In season", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Strawberries", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Blueberries", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Pineapple", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Watermelon", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Kiwi", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Bananas", badge: "Off season", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Red Apples", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Peaches", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Pears", badge: "In season", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Cherries", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Plums", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Lemons", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "fruits", image: cucumber, name: "Limes", price: "42", cta: "cart" },

  // ---------- Snacks (15) ----------
  { category: "snacks", image: snacks, name: "Potato Chips", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Chocolate Bar", badge: "In season", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Pretzel Sticks", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Popcorn", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Trail Mix", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Corn Chips", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Granola Bar", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Gummy Candy", badge: "Off season", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Cheese Puffs", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Rice Crackers", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Cookies", badge: "In season", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Nuts Mix", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Fruit Gummies", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Beef Jerky", badge: "Low in stock", price: "42", cta: "cart" },
  { category: "snacks", image: snacks, name: "Chocolate Wafers", price: "42", cta: "cart" },
];