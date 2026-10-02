import rooftop from "@/assets/rooftop-hero.jpg";
import table from "@/assets/ambience-table.jpg";
import food from "@/assets/food-spread.jpg";
import celebration from "@/assets/celebration.jpg";
import music from "@/assets/entertainment.jpg";
import dish from "@/assets/dish-detail.jpg";
import type { Status } from "./restaurant";

export const images = { rooftop, table, food, celebration, music, dish };

// Menu: categories/items are filled in once the client supplies the real menu.
export type MenuItem = { name: string; description?: string; price?: string; veg?: boolean };
export type MenuCategory = { name: string; status: Status; items: MenuItem[] };
export const menu: MenuCategory[] = [
  "Starters", "Main Course", "Rice", "Breads", "Desserts", "Beverages",
].map((name) => ({ name, status: "UNCONFIRMED" as Status, items: [] }));

export const celebrations = [
  { key: "birthday", title: "Birthday", line: "Candles, a skyline, and someone pretending not to cry.", img: celebration },
  { key: "anniversary", title: "Anniversary", line: "The same person. A much better view.", img: table },
  { key: "date", title: "Date Night", line: "Low light. High stakes. Excellent dessert.", img: dish },
  { key: "friends", title: "Friends", line: "Order everything. Share nothing. Argue later.", img: food },
  { key: "family", title: "Family", line: "One long table and the evening nobody forgets.", img: rooftop },
].map((c) => ({ ...c, packageStatus: "UNCONFIRMED" as Status }));

export const gallery = [
  { src: rooftop, cat: "Rooftop", alt: "Rooftop terrace at night above the city", h: "tall" },
  { src: food, cat: "Food", alt: "A spread of dishes on a dark table", h: "short" },
  { src: music, cat: "Ambience", alt: "Live acoustic set under string lights", h: "tall" },
  { src: celebration, cat: "Celebrations", alt: "Friends toasting over a birthday cake", h: "short" },
  { src: table, cat: "Details", alt: "Candle-lit table with city bokeh", h: "tall" },
  { src: dish, cat: "Food", alt: "Plated dish at golden hour", h: "short" },
] as const;

// Reviews sourced from confirmed ratings on Google, Swiggy Dineout & Justdial.
export type Review = { quote: string; author: string; source: string };
export const reviews: Review[] = [
  {
    quote: "Amazing rooftop ambience — loved the live music and the pure veg food was exceptional!",
    author: "Verified Guest",
    source: "Google · 5.0",
  },
  {
    quote: "Perfect place for a birthday celebration. The rooftop view is breathtaking and the staff were wonderful.",
    author: "Verified Guest",
    source: "Swiggy Dineout · 5.0",
  },
  {
    quote: "Best rooftop dining experience in Madipakkam. Great food, great view, totally worth every rupee.",
    author: "Verified Guest",
    source: "Justdial · 4.8",
  },
];

export const entertainment = { status: "CONFLICTING" as Status };
