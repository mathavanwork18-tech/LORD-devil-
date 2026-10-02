import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Pending, Reveal } from "@/components/site/Reveal";
import { celebrations, images } from "@/data/content";

export const Route = createFileRoute("/celebrations")({
  head: () => ({
    meta: [
      { title: "Celebrations — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "Birthdays, anniversaries, date nights, friends and family — celebrate on the rooftop." },
      { property: "og:title", content: "Make It a Moment — Celebrations" },
      { property: "og:description", content: "Celebrate above the city at Mr Bean Rooftop." },
    ],
  }),
  component: Celebrations,
});

function Celebrations() {
  return (
    <>
      <PageHero eyebrow="Celebrations" title="Make it a moment." img={images.celebration} />
      <section className="mx-auto max-w-7xl space-y-6 px-5 py-20 md:px-8">
        {celebrations.map((c, i) => (
          <Reveal key={c.key} className="group relative h-[60vh] overflow-hidden">
            <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 shade-bottom" />
            <div className="absolute bottom-0 flex w-full flex-wrap items-end justify-between gap-4 p-8 md:p-12">
              <div>
                <p className="eyebrow">0{i + 1}</p>
                <h2 className="display-lg mt-2">{c.title}</h2>
                <p className="mt-3 max-w-md text-foreground/80">{c.line}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <Pending label="Package details pending" />
                <Link to="/book" className="btn-amber">Enquire</Link>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
