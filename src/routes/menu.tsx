import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Pending, Reveal } from "@/components/site/Reveal";
import { Character } from "@/components/site/Character";
import { images, menu } from "@/data/content";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "The Menu — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "Explore the menu at Mr Bean Rooftop Restaurant, from starters to desserts." },
      { property: "og:title", content: "The Menu — Mr Bean Rooftop" },
      { property: "og:description", content: "The difficult part is choosing." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState(menu[0]?.name ?? "");
  const cat = menu.find((c) => c.name === active) ?? { name: active, status: "UNCONFIRMED" as const, items: [] };
  return (
    <>
      <PageHero eyebrow="Starters to sweet endings" title="The Menu" img={images.food} />
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="sticky top-[72px] z-10 -mx-5 flex gap-2 overflow-x-auto bg-background/90 px-5 py-4 backdrop-blur md:mx-0 md:px-0">
          {menu.map((c) => (
            <button key={c.name} onClick={() => setActive(c.name)} className={`shrink-0 border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${active === c.name ? "border-amber bg-amber text-primary-foreground" : "hover:border-amber"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <Reveal key={active} className="mt-12">
          <h2 className="display-lg">{cat.name}</h2>
          {cat.items.length === 0 ? (
            <div className="mt-10 grid items-center gap-8 border p-8 md:grid-cols-[1fr_180px]">
              <div>
                <Pending label="Menu awaiting confirmation" />
                <p className="mt-4 font-display text-2xl italic">The kitchen is finalising this section.</p>
                <p className="mt-2 text-sm text-muted-foreground">Dishes, dietary labels and prices appear here only once the restaurant confirms them.</p>
              </div>
              <div className="w-40"><Character mood="surprised" /></div>
            </div>
          ) : (
            <ul className="mt-10 divide-y">
              {cat.items.map((it) => (
                <li key={it.name} className="flex justify-between gap-6 py-6">
                  <div><p className="font-display text-2xl">{it.name}</p>{it.description && <p className="text-sm text-muted-foreground">{it.description}</p>}</div>
                  {it.price && <p className="text-amber">{it.price}</p>}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </section>
    </>
  );
}
