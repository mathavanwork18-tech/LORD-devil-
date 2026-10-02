import { Diamond } from "lucide-react";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          direction?: "left" | "right" | "up" | "down" | string;
          scrollamount?: number | string;
          scrolldelay?: number | string;
          behavior?: "scroll" | "slide" | "alternate" | string;
          loop?: number | string;
        },
        HTMLElement
      >;
    }
  }
}

// Separator: a tiny Lucide Diamond icon — transparent, consistent with the brand
function Sep() {
  return (
    <span className="marquee-sep" aria-hidden="true">
      <Diamond size={7} strokeWidth={1.5} />
    </span>
  );
}

const PHRASES = [
  "Mr Bean Rooftop",
  "Rooftop Dining",
  "Good Food",
  "Great Moments",
  "Chennai Nights",
  "Food",
  "Friends",
  "Celebrations",
  "Rooftop Moments",
];

function MarqueeItems() {
  return (
    <>
      {PHRASES.map((phrase, i) => (
        <span key={i} className="marquee-item">
          {phrase}
          <Sep />
        </span>
      ))}
    </>
  );
}

/**
 * Marquee — rendered at the very top of the page, above the nav.
 * Uses native marquee tag with direction="left" for smooth cross-browser scrolling
 * that functions reliably across all device settings.
 */
export function Marquee() {
  return (
    <div
      className="marquee-strip"
      role="region"
      aria-label="Mr Bean Rooftop Restaurant — running announcement"
    >
      <marquee
        direction="left"
        scrollamount={4}
        behavior="scroll"
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).stop?.()}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).start?.()}
        className="marquee-tag"
      >
        <div className="marquee-content-row">
          <MarqueeItems />
          <MarqueeItems />
          <MarqueeItems />
          <MarqueeItems />
        </div>
      </marquee>
    </div>
  );
}

