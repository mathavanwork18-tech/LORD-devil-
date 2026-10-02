import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import {
  MapPin, Phone, Clock, CalendarCheck, Star, Utensils,
  Armchair, ParkingSquare, Music, Users, Info, ExternalLink, Leaf,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Pending, Reveal } from "@/components/site/Reveal";
import { images } from "@/data/content";
import { restaurant } from "@/data/restaurant";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "Address, hours, phone and directions for Mr Bean Rooftop Restaurant, Madipakkam, Chennai." },
      { property: "og:title", content: "See You Upstairs — Visit" },
      { property: "og:description", content: "How to find the rooftop." },
    ],
  }),
  component: Visit,
});

function FactRow({
  icon: Icon,
  label,
  children,
  note,
  status = "CONFIRMED",
}: {
  icon: typeof MapPin;
  label: string;
  children?: React.ReactNode;
  note?: string;
  status?: "CONFIRMED" | "UNCONFIRMED" | "CONFLICTING";
}) {
  return (
    <div className="flex gap-5 border-b py-6">
      <Icon className="mt-1 shrink-0 text-amber" size={20} />
      <div className="flex-1">
        <p className="eyebrow">{label}</p>
        <div className="mt-2 text-lg leading-relaxed">
          {children ?? (
            <Pending
              label={
                status === "CONFLICTING" ? "Being verified — call ahead to confirm" : "Awaiting confirmation"
              }
            />
          )}
        </div>
        {note && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-amber/80">
            <Info size={13} className="mt-0.5 shrink-0" />
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

function RatingBadge({ platform, rating, reviews }: { platform: string; rating: string; reviews: string }) {
  return (
    <div className="flex flex-col gap-1 rounded border border-amber/20 bg-amber/5 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber">{platform}</p>
      <p className="flex items-center gap-1 font-display text-2xl">
        <Star size={14} className="text-amber" fill="currentColor" />
        {rating}
      </p>
      <p className="text-xs text-muted-foreground">{reviews}</p>
    </div>
  );
}

function SeatingTag({ label, confirmed }: { label: string; confirmed?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm ${confirmed ? "border-amber/30 bg-amber/10 text-amber" : "border-dashed text-muted-foreground"}`}>
      {confirmed ? <Armchair size={13} /> : <Info size={13} />}
      {label}
    </span>
  );
}

function Visit() {
  return (
    <>
      <PageHero eyebrow="Visit" title="See you upstairs." img={images.rooftop} />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-16 md:grid-cols-[1fr_420px]">

          {/* ── Left: all facts ── */}
          <Reveal>
            {/* Address */}
            <FactRow icon={MapPin} label="Address">
              <span className="block">Plot No. 20A, First Floor, Lake View Road,</span>
              <span className="block">Senthuran Colony, Ayyappan Nagar,</span>
              <span className="block font-semibold">Madipakkam, Chennai – 600091</span>
              <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin size={12} className="shrink-0" /> Near Lake Park, Madipakkam
              </span>
            </FactRow>

            {/* Hours */}
            <FactRow
              icon={Clock}
              label="Hours"
              status="CONFLICTING"
              note="Some listings show opening at 3:00 PM. Call ahead to confirm the exact opening time."
            >
              <span>Monday – Sunday</span>
              <span className="mx-2 text-amber">·</span>
              <span className="font-semibold text-amber">12:00 PM – 1:00 AM</span>
            </FactRow>

            {/* Phone */}
            <FactRow icon={Phone} label="Phone" status="UNCONFIRMED">
              <Pending label="Contact number available on Justdial — tap 'Show Number'" />
            </FactRow>

            {/* Booking */}
            <FactRow icon={CalendarCheck} label="How to book">
              <span className="block">Reserve your table via Swiggy Dineout</span>
              <a
                href="https://www.swiggy.com/restaurants/mr-bean-rooftop-restaurant-madipakkam-chennai-1381851/dineout"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-amber underline underline-offset-4"
              >
                Book on Swiggy Dineout <ExternalLink size={12} />
              </a>
            </FactRow>

            {/* Dietary */}
            <FactRow icon={Utensils} label="Food type">
              <span className="inline-flex items-center gap-1.5 font-semibold text-green-400"><Leaf size={14} /> 100% Pure Veg</span>
              <span className="ml-3 text-base text-muted-foreground">Indo-Chinese · Continental · North Indian</span>
            </FactRow>

            {/* Pricing */}
            <FactRow icon={Users} label="Average cost">
              <span className="text-2xl font-display font-semibold text-amber">₹400</span>
              <span className="ml-2 text-base text-muted-foreground">for two people</span>
            </FactRow>

            {/* Seating */}
            <FactRow icon={Armchair} label="Seating options">
              <div className="flex flex-wrap gap-2 mt-1">
                <SeatingTag label="Rooftop (Open Air)" confirmed />
                <SeatingTag label="AC Indoor Rooms" confirmed />
                <SeatingTag label="Party Hall (capacity TBC)" />
              </div>
            </FactRow>

            {/* Parking */}
            <FactRow icon={ParkingSquare} label="Parking">
              <span>Available</span>
              <span className="ml-2 text-sm text-muted-foreground">(2W/4W capacity details unconfirmed)</span>
            </FactRow>

            {/* Entertainment */}
            <FactRow
              icon={Music}
              label="Entertainment"
              status="CONFLICTING"
              note="Live music and dancing reported by guests. Days and schedule yet to be confirmed."
            >
              <span>Live music & dancing</span>
              <span className="ml-2 inline-flex items-center gap-1 rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                <Info size={10} /> schedule pending
              </span>
            </FactRow>

            {/* Celebrations */}
            <FactRow icon={Star} label="Celebrations">
              <span className="block">Suitable for Birthdays & Anniversaries</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Decoration packages & exact pricing are not yet published. Contact the restaurant directly.
              </span>
            </FactRow>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/book" className="btn-amber">Book a table</Link>
              <a
                className="btn-ghost"
                target="_blank"
                rel="noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=Mr+Bean+Rooftop+Restaurant+Madipakkam+Chennai"
              >
                Get directions
              </a>
            </div>
          </Reveal>

          {/* ── Right: ratings + map ── */}
          <div className="space-y-8">
            {/* Ratings */}
            <Reveal delay={0.1}>
              <p className="eyebrow mb-4">Ratings</p>
              <div className="grid grid-cols-3 gap-3">
                <RatingBadge platform="Google" rating="4.8 – 5.0" reviews="16–27 reviews" />
                <RatingBadge platform="Justdial" rating="4.8 – 5.0" reviews="16–21 reviews" />
                <RatingBadge platform="Swiggy" rating="5.0" reviews="27 reviews" />
              </div>
            </Reveal>

            {/* Map placeholder */}
            <Reveal delay={0.15} className="flex min-h-[360px] items-center justify-center border border-dashed bg-card">
              <div className="text-center p-6">
                <MapPin className="mx-auto text-amber" size={36} />
                <p className="mt-4 font-semibold">Madipakkam, Chennai</p>
                <p className="mt-1 text-sm text-muted-foreground">Senthuran Colony, Ayyappan Nagar</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Mr+Bean+Rooftop+Restaurant+Madipakkam+Chennai"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-amber underline underline-offset-4"
                >
                  Open in Google Maps <ExternalLink size={12} />
                </a>
              </div>
            </Reveal>

            {/* Quick summary card */}
            <Reveal delay={0.2} className="rounded border border-amber/20 bg-amber/5 p-6 space-y-3">
              <p className="eyebrow text-amber">Quick facts</p>
              {([
                [MapPin,         "Address",  "Madipakkam, Chennai 600091"],
                [Leaf,           "Food",     "100% Pure Veg"],
                [Clock,          "Hours",    "12:00 PM – 1:00 AM (verify opening)"],
                [Users,          "Cost",     "₹400 for two"],
                [Armchair,       "Seating",  "Rooftop + AC Indoor + Party Hall"],
                [ParkingSquare,  "Parking",  "Available"],
                [Music,          "Music",    "Live music (schedule TBC)"],
              ] as [React.ElementType, string, string][]).map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-2 text-sm">
                  <Icon size={13} className="mt-0.5 shrink-0 text-amber" />
                  <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
