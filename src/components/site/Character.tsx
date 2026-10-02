import { motion } from "framer-motion";
import curious from "@/assets/character-curious.png";
import surprised from "@/assets/character-surprised.png";

export type Mood = "curious" | "surprised";
const src = { curious, surprised };

export function Character({ mood = "curious", className = "", flip = false }: { mood?: Mood; className?: string; flip?: boolean }) {
  return (
    <motion.img
      key={mood}
      src={src[mood]}
      alt={mood === "curious" ? "Our quirky host tiptoeing in, curious" : "Our host delighted by the menu"}
      width={768}
      height={1152}
      initial={{ opacity: 0, rotate: -4, y: 20 }}
      animate={{ opacity: 1, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      whileHover={{ rotate: [0, -3, 3, -2, 0], transition: { duration: 0.6 } }}
      className={`select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] ${flip ? "-scale-x-100" : ""} ${className}`}
      draggable={false}
    />
  );
}
