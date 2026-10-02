import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star, ExternalLink, User, Quote, ArrowRight, AlertCircle,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/content";
import {
  fetchGoogleReviews,
  googleSummary,
  GOOGLE_REVIEWS_URL,
  type GoogleReview,
} from "@/data/reviews";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "Real guest reviews for Mr Bean Rooftop Restaurant, Madipakkam, Chennai. See what people say about our rooftop dining experience." },
      { property: "og:title", content: "Real Moments. Real Reviews. — Mr Bean Rooftop" },
      { property: "og:description", content: "See what guests have to say about their time at Mr Bean Rooftop." },
    ],
  }),
  component: Reviews,
});

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Renders 1–5 filled/unfilled stars */
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i < rating ? "text-amber" : "text-foreground/20"}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

/** Aggregate rating block shown in the hero area */
function RatingSummary() {
  const filledWidth = `${(googleSummary.rating / 5) * 100}%`;
  return (
    <Reveal className="mx-auto mt-16 max-w-sm">
      <div className="flex flex-col items-center gap-4 border border-amber/20 bg-card px-8 py-8">
        <p className="eyebrow">Google Rating</p>
        {/* Large rating numeral */}
        <p className="font-display text-7xl leading-none text-amber">
          {googleSummary.rating.toFixed(1)}
        </p>
        {/* Star bar */}
        <div className="relative h-1 w-32 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-amber"
            initial={{ width: 0 }}
            whileInView={{ width: filledWidth }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <StarRow rating={Math.round(googleSummary.rating)} size={16} />
        <p className="text-sm text-muted-foreground">
          Based on {googleSummary.totalReviews}+ guest reviews
        </p>
        {GOOGLE_REVIEWS_URL && (
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-amber hover:underline"
          >
            View on Google <ExternalLink size={11} />
          </a>
        )}
      </div>
    </Reveal>
  );
}

/** Format ISO date to readable form */
function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Single review card */
function ReviewCard({ review, index }: { review: GoogleReview; index: number }) {
  const isDevData = review.reviewerName === "Rooftop Guest";
  return (
    <Reveal delay={index * 0.07}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="group relative flex h-full flex-col border border-border bg-card p-7 transition-colors duration-500 hover:border-amber/30"
      >
        {/* Faint quote mark decoration */}
        <Quote
          size={28}
          strokeWidth={1}
          className="absolute right-6 top-6 text-amber/10 transition-colors duration-500 group-hover:text-amber/20"
        />

        {/* Reviewer header */}
        <div className="flex items-center gap-3">
          {review.reviewerPhoto ? (
            <img
              src={review.reviewerPhoto}
              alt={review.reviewerName}
              className="h-10 w-10 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber/20 bg-amber/5">
              <User size={16} className="text-amber/60" />
            </span>
          )}
          <div>
            <p className="text-sm font-semibold leading-tight">
              {isDevData ? (
                <span className="text-foreground/50 italic text-xs">[Dev placeholder]</span>
              ) : (
                review.reviewerName
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(review.date)}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="mt-4">
          <StarRow rating={review.rating} />
        </div>

        {/* Review text */}
        <p className="mt-4 flex-1 font-display text-xl italic leading-relaxed text-foreground/80">
          "{review.comment}"
        </p>

        {/* Google attribution */}
        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {/* Inline Google "G" SVG — no external asset, transparent background */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-label="Google" role="img">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google review
          </span>
          {review.reviewUrl && (
            <a
              href={review.reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber/60 transition-colors hover:text-amber"
              aria-label="View original review on Google"
            >
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </motion.article>
    </Reveal>
  );
}

/** Dev-mode notice shown when mock data is displayed */
function DevNotice() {
  return (
    <div className="mx-auto mb-12 flex max-w-2xl items-start gap-3 border border-dashed border-amber/30 bg-amber/5 p-4 text-sm">
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber" />
      <p className="text-muted-foreground">
        <span className="font-semibold text-amber">Development mode —</span>{" "}
        Displaying structural placeholder data. Connect the Google Places API
        (add <code className="text-xs">VITE_GOOGLE_PLACES_API_KEY</code> and a
        verified Place ID to <code className="text-xs">.env</code>) to display
        real guest reviews.
      </p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

function Reviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const isUsingMock = !import.meta.env['VITE_GOOGLE_PLACES_API_KEY'];

  useEffect(() => {
    fetchGoogleReviews()
      .then((data) => { setReviews(data); setStatus("ok"); })
      .catch(() => setStatus("error"));
  }, []);

  const shown = reviews.slice(0, visible);
  const hasMore = visible < reviews.length;

  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="Reviews"
        title="Real moments. Real reviews."
        img={images.rooftop}
      >
        <p className="mt-5 max-w-md text-lg text-foreground/75">
          See what guests have to say about their time at Mr Bean Rooftop.
        </p>
      </PageHero>

      {/* ── Rating summary ── */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <Reveal>
            <p className="eyebrow">What people say</p>
            <h2 className="display-lg mt-5">
              The rooftop speaks<br />
              <em className="normal-case text-amber">for itself.</em>
            </h2>
          </Reveal>
          <RatingSummary />
        </div>
      </section>

      {/* ── Review cards ── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Guest reviews</p>
              <h2 className="display-lg mt-5">What they said.</h2>
            </div>
            {GOOGLE_REVIEWS_URL && (
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                All Google reviews <ExternalLink size={13} />
              </a>
            )}
          </Reveal>

          {/* Dev notice */}
          {isUsingMock && status === "ok" && <DevNotice />}

          {/* Loading */}
          {status === "loading" && (
            <div className="flex items-center justify-center py-32">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber border-t-transparent" />
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <Reveal className="flex flex-col items-center gap-4 py-32 text-center">
              <AlertCircle size={36} className="text-amber/50" />
              <p className="text-muted-foreground">
                Could not load reviews right now. Please try again later.
              </p>
            </Reveal>
          )}

          {/* Empty */}
          {status === "ok" && reviews.length === 0 && (
            <Reveal className="py-32 text-center">
              <Quote size={36} className="mx-auto text-amber/30" />
              <p className="mt-6 text-muted-foreground">
                Real guest reviews will appear here once the Google Places API is connected.
              </p>
            </Reveal>
          )}

          {/* Cards grid */}
          {status === "ok" && reviews.length > 0 && (
            <>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((review, i) => (
                  <ReviewCard key={i} review={review} index={i} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <Reveal className="mt-14 text-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="btn-ghost"
                  >
                    Load more reviews <ArrowRight size={14} />
                  </button>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Platform ratings bar ── */}
      <section className="bg-cream py-20 text-cream-foreground">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow !text-secondary">Across platforms</p>
            <h2 className="display-lg mt-5">Consistently rated top.</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { platform: "Google", rating: 4.8, reviews: "16–27 reviews" },
              { platform: "Justdial", rating: 4.8, reviews: "16–21 reviews" },
              { platform: "Swiggy Dineout", rating: 5.0, reviews: "27 reviews" },
            ].map(({ platform, rating, reviews: rev }, i) => (
              <Reveal key={platform} delay={i * 0.08}>
                <div className="flex flex-col gap-3 border border-cream-foreground/10 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                    {platform}
                  </p>
                  <p className="font-display text-5xl text-cream-foreground">
                    {rating.toFixed(1)}
                  </p>
                  <StarRow rating={Math.round(rating)} />
                  <p className="text-xs text-cream-foreground/60">{rev}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google CTA ── */}
      <section className="relative overflow-hidden bg-ink py-28">
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 glow-amber" />
        <Reveal className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
          <Quote size={32} className="mx-auto text-amber/40" />
          <h2 className="display-xl mt-6">
            Read more reviews
            <br />
            <em className="normal-case text-amber">on Google.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted-foreground">
            See the full listing, photos, and every guest review on Google Maps.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {GOOGLE_REVIEWS_URL ? (
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-amber"
              >
                Read more on Google <ExternalLink size={14} />
              </a>
            ) : (
              <span className="pending-tag">Google profile URL pending verification</span>
            )}
            <Link to="/book" className="btn-ghost">
              Book a table <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
