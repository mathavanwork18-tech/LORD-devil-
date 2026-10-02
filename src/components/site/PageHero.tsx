import { motion } from "framer-motion";

export function PageHero({ eyebrow, title, img, children }: { eyebrow: string; title: string; img: string; children?: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden">
      <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: "easeOut" }} src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 shade-full" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="eyebrow">{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="display-xl mt-4">{title}</motion.h1>
        {children}
      </div>
    </section>
  );
}
