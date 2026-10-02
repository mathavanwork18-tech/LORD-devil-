import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ChevronDown, Music, Sparkles, Quote, Users2, Star } from "lucide-react";
import { Character, type Mood } from "@/components/site/Character";
import { Reveal, Pending } from "@/components/site/Reveal";
import { images, celebrations, gallery, reviews } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mr Bean Rooftop Restaurant — Something Is Happening Upstairs" },
      { name: "description", content: "A cinematic rooftop restaurant. Good food, great views and unexpected moments. Book your table above the ordinary." },
      { property: "og:title", content: "Mr Bean Rooftop Restaurant" },
      { property: "og:description", content: "Good food. Great views. Unexpected moments." },
    ],
  }),
  component: Home,
});

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const charX = useTransform(scrollYProgress, [0, 0.5], ["-10vw", "22vw"]);
  const charScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7]);
  const doorW = useTransform(scrollYProgress, [0.1, 0.45], ["2px", "100vw"]);
  const doorOp = useTransform(scrollYProgress, [0.4, 0.55], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0.3, 1], ["10%", "-5%"]);
  const bgOp = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const introOp = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleOp = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.5, 0.7], [60, 0]);
  const [mood, setMood] = useState<Mood>("curious");
  useMotionValueEvent(scrollYProgress, "change", (v) => setMood(v > 0.5 ? "surprised" : "curious"));

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <motion.img src={images.rooftop} alt="The rooftop at night" width={1920} height={1088} style={{ y: bgY, opacity: bgOp }} className="absolute inset-0 h-[115%] w-full object-cover" />
        <div className="absolute inset-0 shade-full" />
        {/* the door of light */}
        <motion.div style={{ width: doorW, opacity: doorOp }} className="absolute left-1/2 top-0 h-full -translate-x-1/2 bg-amber/90 shadow-[0_0_120px_40px] shadow-amber/50" />
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 glow-amber opacity-40" />

        <motion.div style={{ opacity: introOp }} className="absolute inset-x-0 top-1/3 text-center">
          <p className="eyebrow">Something interesting is happening upstairs.</p>
          <ChevronDown className="mx-auto mt-6 animate-bounce text-amber" />
        </motion.div>

        <motion.div style={{ x: charX, scale: charScale }} className="absolute bottom-0 left-[10%] w-[42vw] max-w-[340px] origin-bottom md:left-[20%]">
          <Character mood={mood} />
        </motion.div>

        <motion.div style={{ opacity: titleOp, y: titleY }} className="absolute inset-x-0 bottom-[14vh] mx-auto max-w-7xl px-5 md:px-8">
          <h1 className="display-xl">Mr Bean<br /><span className="italic text-amber normal-case">Rooftop</span> Restaurant</h1>
          <p className="mt-6 max-w-md text-lg text-foreground/80">Good food. Great views. Unexpected moments.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn-amber">Book a table <ArrowRight size={16} /></Link>
            <Link to="/experience" className="btn-ghost">Explore the rooftop</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RooftopSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-12 md:px-8">
        <Reveal className="md:col-span-5">
          <p className="eyebrow">The rooftop</p>
          <h2 className="display-lg mt-5">Your table is above <em className="text-amber">the ordinary.</em></h2>
          <p className="mt-6 max-w-sm text-muted-foreground">The city switches its lights on. You switch your phone off. Somewhere, a candle flickers for you.</p>
        </Reveal>
        <div className="relative h-[70vh] overflow-hidden md:col-span-7">
          <motion.img style={{ y }} src={images.table} alt="Candle-lit rooftop table" loading="lazy" className="absolute inset-0 h-[125%] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Questions() {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-cream py-28 text-cream-foreground md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        <Reveal>
          <p className="eyebrow !text-secondary">Meet the host</p>
          <h2 className="display-lg mt-5">He has questions.</h2>
          <p className="mt-6 max-w-md text-cream-foreground/70">About the menu. About the plate. About whether that glass is his. Tap the menu and see what happens.</p>
          <button onClick={() => setOpen((o) => !o)} className="mt-8 inline-flex items-center gap-2 border-b-2 border-secondary pb-1 text-xs font-bold uppercase tracking-[0.22em]">
            {open ? "Close the menu" : "Open the menu"} <Sparkles size={14} />
          </button>
        </Reveal>
        <div className="relative flex h-[520px] items-end justify-center">
          <motion.div animate={{ scale: open ? 1 : 0.6, opacity: open ? 1 : 0, rotate: open ? -6 : 0 }} transition={{ type: "spring", stiffness: 90 }} className="absolute right-0 top-6 w-56 overflow-hidden shadow-2xl md:w-72">
            <img src={images.dish} alt="A plated dish" loading="lazy" className="aspect-square w-full object-cover" />
          </motion.div>
          <div className="w-[260px]"><Character mood={open ? "surprised" : "curious"} /></div>
        </div>
      </div>
    </section>
  );
}

function Food() {
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The food</p>
            <h2 className="display-lg mt-5 max-w-3xl">The difficult part is <em className="text-amber">choosing.</em></h2>
          </div>
          <Link to="/menu" className="btn-ghost">Explore menu <ArrowRight size={14} /></Link>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Reveal className="relative md:col-span-2 md:row-span-2">
            <img src={images.food} alt="A spread of dishes" loading="lazy" className="h-full min-h-[420px] w-full object-cover" />
            <div className="absolute bottom-4 left-4"><Pending label="Signature dishes coming soon" /></div>
          </Reveal>
          <Reveal delay={0.1}><img src={images.dish} alt="Plated dish" loading="lazy" className="aspect-square w-full object-cover" /></Reveal>
          <Reveal delay={0.2} className="flex flex-col justify-center border p-8">
            <p className="font-display text-2xl italic">Dish names and prices will appear here once the kitchen confirms them.</p>
            <p className="mt-3 text-sm text-muted-foreground">We don't make up food. Our host tried. It was a disaster.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Ambience() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <img src={images.rooftop} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/60" />
      <Reveal className="relative mx-auto max-w-5xl px-5 text-center">
        <p className="eyebrow">The mood</p>
        <h2 className="display-xl mt-6">Come for the food.<br /><em className="normal-case text-amber">Stay for the mood.</em></h2>
      </Reveal>
    </section>
  );
}

function Celebrate() {
  return (
    <section className="bg-secondary py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal><p className="eyebrow">Celebrations</p><h2 className="display-lg mt-5">Make it a moment.</h2></Reveal>
        <div className="mt-12 flex snap-x gap-4 overflow-x-auto pb-4">
          {celebrations.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.06} className="group relative h-[440px] w-[300px] shrink-0 snap-start overflow-hidden">
              <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 shade-bottom" />
              <div className="absolute bottom-0 p-6">
                <h3 className="text-3xl">{c.title}</h3>
                <p className="mt-2 text-sm text-foreground/75">{c.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link to="/celebrations" className="btn-ghost mt-8">Plan a celebration</Link>
      </div>
    </section>
  );
}

function Entertainment() {
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <Reveal><img src={images.music} alt="Live music on the rooftop" loading="lazy" className="aspect-[4/5] w-full object-cover" /></Reveal>
        <Reveal delay={0.1}>
          <Music className="text-amber" />
          <p className="eyebrow mt-6">After dark</p>
          <h2 className="display-lg mt-5">Live music.<br /><em className="text-amber normal-case">Dance the night away.</em></h2>
          <p className="mt-6 max-w-md text-muted-foreground">Our guests say it best — live music and dancing upstairs, above the ordinary. Exact schedule coming soon.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded border border-amber/30 bg-amber/10 px-3 py-1.5 text-sm text-amber"><Music size={13} /> Live Music</span>
            <span className="inline-flex items-center gap-1.5 rounded border border-amber/30 bg-amber/10 px-3 py-1.5 text-sm text-amber"><Users2 size={13} /> Dancing</span>
            <Pending label="Full schedule pending" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GalleryStrip() {
  return (
    <section className="pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex items-end justify-between"><h2 className="display-lg">Seen upstairs.</h2><Link to="/gallery" className="eyebrow hover:underline">Full gallery</Link></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.slice(0, 4).map((g, i) => (
            <Reveal key={i} delay={i * 0.05}><img src={g.src} alt={g.alt} loading="lazy" className={`w-full object-cover ${i % 2 ? "aspect-[3/4]" : "aspect-square"}`} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-cream py-28 text-cream-foreground">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <Quote className="mx-auto text-secondary" />
        <h2 className="display-lg mt-6">People talk.</h2>
        <p className="mx-auto mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-cream-foreground/60"><Star size={12} className="text-secondary" fill="currentColor" /> Rated 4.8 – 5.0 across Google, Justdial &amp; Swiggy Dineout</p>
        {reviews.length === 0 ? (
          <p className="mx-auto mt-6 max-w-lg text-cream-foreground/70">Real guest reviews will live here — verified, attributed, and unedited. We'd rather show nothing than something made up.</p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {reviews.map((r, i) => (
              <figure key={i} className="text-left"><blockquote className="font-display text-2xl italic">“{r.quote}”</blockquote><figcaption className="mt-3 text-xs uppercase tracking-widest text-secondary">{r.author} · {r.source}</figcaption></figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-32">
      <div className="absolute left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 glow-amber" />
      <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-5 md:grid-cols-[1fr_auto] md:px-8">
        <Reveal>
          <p className="eyebrow">Tonight?</p>
          <h2 className="display-xl mt-6">Your table<br /><em className="normal-case text-amber">is waiting.</em></h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/book" className="btn-amber">Book a table <ArrowRight size={16} /></Link>
            <Link to="/visit" className="btn-ghost">Contact us</Link>
          </div>
        </Reveal>
        <div className="mx-auto w-[220px]"><Character mood="curious" flip /></div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <RooftopSection />
      <Questions />
      <Food />
      <Ambience />
      <Celebrate />
      <Entertainment />
      <GalleryStrip />
      <Reviews />
      <FinalCta />
    </>
  );
}
