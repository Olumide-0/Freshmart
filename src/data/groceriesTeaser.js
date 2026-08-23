import mango from "../assets/image/image 82.png";
import lettuce from "../assets/image/image 84.png";
import cucumber from "../assets/image/image 85 (1).png";
import tomato from "../assets/image/image 87.png";

const RAW_TEASER = [
  { title: "Sweet Mangoes", subtitle: "Harvested this week", image: mango },
  { title: "Local Lettuce", subtitle: "Crisp, fresh, local", image: lettuce },
  { title: "Sweet Mangoes", subtitle: "Picked fresh, everyday", image: tomato },
  { title: "Cucumbers", subtitle: "Crips, always fresh", image: cucumber },
];

export const GROCERIES_TEASER = RAW_TEASER.map((p, i) => ({
  ...p,
  slug: `${p.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`,
}));