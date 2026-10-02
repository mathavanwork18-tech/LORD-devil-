import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Marquee } from "@/components/site/Marquee";

const links = [
  { to: "/experience", label: "Experience" },
  { to: "/menu", label: "Menu" },
  { to: "/celebrations", label: "Celebrations" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/visit", label: "Visit" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <Marquee />
      <header
        style={{ top: "var(--marquee-h)" }}
        className={`fixed inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/75 backdrop-blur-md border-b" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" className="font-display text-xl tracking-wide md:text-2xl">
            MR BEAN <span className="text-amber italic">rooftop</span>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-xs uppercase tracking-[0.22em] text-foreground/75 transition-colors hover:text-amber" activeProps={{ className: "!text-amber" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/book" className="btn-amber hidden !py-3 sm:inline-flex">Book a table</Link>
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 lg:hidden"><Menu /></button>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 py-5" role="dialog" aria-modal="true">
            <div className="flex justify-between">
              <span className="font-display text-xl">MR BEAN <span className="text-amber italic">rooftop</span></span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
            </div>
            <div className="mt-16 flex flex-col gap-5">
              {[{ to: "/", label: "Home" }, ...links, { to: "/book", label: "Book a table" }].map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to={l.to} onClick={() => setOpen(false)} className="flex items-center justify-between border-b pb-4 font-display text-4xl">
                    {l.label} <ArrowUpRight className="text-amber" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
