import { Link } from "@tanstack/react-router";
import { restaurant, isLive } from "@/data/restaurant";
import { Pending } from "./Reveal";

export function Footer() {
  return (
    <footer className="border-t bg-ink pb-28 pt-16 sm:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-3xl">MR BEAN <span className="text-amber italic">rooftop</span></p>
          <p className="mt-3 text-sm text-muted-foreground">{restaurant.tagline}</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow">Find us</p>
          <div>{isLive(restaurant.address) ? restaurant.address.value : <Pending label="Address pending" />}</div>
          <div>{isLive(restaurant.hours) ? restaurant.hours.value : <Pending label="Hours pending" />}</div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="eyebrow">Explore</p>
          <Link to="/menu" className="hover:text-amber">Menu</Link>
          <Link to="/celebrations" className="hover:text-amber">Celebrations</Link>
          <Link to="/gallery" className="hover:text-amber">Gallery</Link>
          <Link to="/visit" className="hover:text-amber">Visit</Link>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl px-5 text-xs text-muted-foreground md:px-8">© {new Date().getFullYear()} Mr Bean Rooftop Restaurant. Our host is an original character.</p>
    </footer>
  );
}

export function MobileBookBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 p-3 backdrop-blur sm:hidden">
      <Link to="/book" className="btn-amber w-full justify-center">Book a table</Link>
    </div>
  );
}
