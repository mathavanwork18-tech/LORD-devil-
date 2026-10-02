import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/content";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "The Rooftop Experience — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "The view, the table, the light, the night and the moment — the rooftop experience." },
      { property: "og:title", content: "The Rooftop Experience" },
      { property: "og:description", content: "Five chapters of an evening above the city." },
    ],
  }),
  component: Experience,
});

const chapters = [
  { n: "01", t: "The View", c: "The city laid out like a dessert trolley. Take your time.", img: images.rooftop },
  { n: "02", t: "The Table", c: "Linen, candlelight, and a chair that's definitely yours.", img: images.table },
  { n: "03", t: "The Light", c: "Golden hour arrives. Everyone suddenly looks wonderful.", img: images.dish },
  { n: "04", t: "The Night", c: "String lights on. Music up. Conversation louder.", img: images.music },
  { n: "05", t: "The Moment", c: "The one you'll retell for years. Slightly exaggerated.", img: images.celebration },
];

function Experience() {
  return (
    <>
      <PageHero eyebrow="An evening in five chapters" title="The Rooftop Experience" img={images.rooftop} />
      {chapters.map((ch, i) => (
        <section key={ch.n} className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <Reveal className={i % 2 ? "md:order-2" : ""}><img src={ch.img} alt={ch.t} loading="lazy" className="aspect-[4/5] w-full object-cover" /></Reveal>
          <Reveal delay={0.1}>
            <p className="font-display text-7xl text-amber/40">{ch.n}</p>
            <h2 className="display-lg mt-2">{ch.t}</h2>
            <p className="mt-5 max-w-sm text-lg text-muted-foreground">{ch.c}</p>
          </Reveal>
        </section>
      ))}
      <div className="pb-24 text-center"><Link to="/book" className="btn-amber">Book your chapter</Link></div>
    </>
  );
}
