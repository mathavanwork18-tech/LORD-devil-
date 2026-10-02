import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { gallery, images } from "@/data/content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "Food, rooftop, ambience and celebrations — scenes from upstairs." },
      { property: "og:title", content: "Gallery — Mr Bean Rooftop" },
      { property: "og:description", content: "Scenes from the rooftop." },
    ],
  }),
  component: Gallery,
});

const cats = ["All", "Food", "Rooftop", "Ambience", "Celebrations", "Details"];

function Gallery() {
  const [cat, setCat] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);
  const list = gallery.filter((g) => cat === "All" || g.cat === cat);
  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i! + 1) % list.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i! - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx, list.length]);

  return (
    <>
      <PageHero eyebrow="Seen upstairs" title="Gallery" img={images.music} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] ${cat === c ? "border-amber text-amber" : ""}`}>{c}</button>
          ))}
        </div>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {list.map((g, i) => (
            <button key={g.alt} onClick={() => setIdx(i)} className="mb-4 block w-full overflow-hidden" aria-label={`Open ${g.alt}`}>
              <img src={g.src} alt={g.alt} loading="lazy" className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${g.h === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
            </button>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {idx !== null && list[idx] && (
          <motion.div role="dialog" aria-modal="true" aria-label={list[idx].alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-6" onClick={() => setIdx(null)}>
            <button aria-label="Close" className="absolute right-6 top-6"><X /></button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + list.length) % list.length); }} className="absolute left-4"><ChevronLeft size={36} /></button>
            <img src={list[idx].src} alt={list[idx].alt} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % list.length); }} className="absolute right-4"><ChevronRight size={36} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
