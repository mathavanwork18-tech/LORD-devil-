import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { Loader2, Check, X, CalendarDays, Clock, Users, User, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Character } from "@/components/site/Character";
import { Pending } from "@/components/site/Reveal";
import { restaurant, isLive } from "@/data/restaurant";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Table — Mr Bean Rooftop Restaurant" },
      { name: "description", content: "Request a table at Mr Bean Rooftop Restaurant." },
      { property: "og:title", content: "Book a Table — Mr Bean Rooftop" },
      { property: "og:description", content: "Your table is waiting." },
    ],
  }),
  component: Book,
});

// ── Validation ─────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,15}$/, "Enter a valid phone number"),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  guests: z.coerce.number().int().min(1, "At least one guest").max(30, "For 30+ guests, please call us"),
  message: z.string().max(500).optional(),
});

type State = "idle" | "submitting" | "success" | "error";

interface BookingData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string | undefined;
}

// ── Animated success check icon ────────────────────────────────────────────────

function SuccessIcon({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
      {/* Circle */}
      <motion.svg
        viewBox="0 0 64 64"
        fill="none"
        className="absolute inset-0 h-full w-full"
        initial={false}
      >
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="var(--amber)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Check */}
        <motion.path
          d="M20 33 L28 41 L44 25"
          stroke="var(--amber)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.35, delay: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </motion.svg>
    </div>
  );
}

// ── Booking detail row ─────────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  delay: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="flex items-start gap-3 border-b border-foreground/10 py-3 last:border-0"
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon size={14} className="mt-0.5 shrink-0 text-amber" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="eyebrow text-foreground/40">{label}</p>
        <p className="mt-0.5 text-sm font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}

// ── Confirmation modal ─────────────────────────────────────────────────────────

function ConfirmationModal({
  booking,
  onClose,
}: {
  booking: BookingData;
  onClose: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const formattedDate = (() => {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }).format(new Date(booking.date + "T00:00:00"));
    } catch { return booking.date; }
  })();

  const formattedTime = (() => {
    try {
      const [h, m] = booking.time.split(":").map(Number);
      return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(
        new Date(2000, 0, 1, h, m)
      );
    } catch { return booking.time; }
  })();

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-heading"
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-sm overflow-hidden border border-amber/20 bg-card px-7 py-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] sm:px-8"
        initial={{ opacity: 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 8 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.8 }}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber/8 blur-3xl" />

        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-foreground/40 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        >
          <X size={16} />
        </button>

        {/* Success icon */}
        <SuccessIcon reduced={reduced} />

        {/* Headings */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <p className="eyebrow text-amber">Reservation</p>
          <h2
            id="confirm-heading"
            className="mt-2 font-display text-4xl font-medium leading-tight sm:text-5xl"
          >
            Request<br />
            <em className="normal-case text-amber">received.</em>
          </h2>
        </motion.div>

        {/* Message */}
        <motion.p
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.45 }}
        >
          We've received your reservation request. Our team will confirm your table shortly.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="my-6 border-t border-foreground/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        />

        {/* Restaurant label */}
        <motion.p
          className="eyebrow mb-3 text-foreground/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.78 }}
        >
          Mr Bean Rooftop
        </motion.p>

        {/* Booking details */}
        <div>
          <DetailRow icon={User}        label="Name"   value={booking.name}    delay={0.82} />
          <DetailRow icon={CalendarDays} label="Date"   value={formattedDate}   delay={0.88} />
          <DetailRow icon={Clock}       label="Time"   value={formattedTime}   delay={0.94} />
          <DetailRow icon={Users}       label="Guests" value={`${booking.guests} ${Number(booking.guests) === 1 ? "guest" : "guests"}`} delay={1.0} />
          <DetailRow icon={Phone}       label="Phone"  value={booking.phone}   delay={1.06} />
        </div>

        {/* Phone not confirmed notice */}
        {!isLive(restaurant.phone) && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Pending label="Booking confirmation pending" />
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="mt-6 flex flex-col gap-3"
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.12, duration: 0.4 }}
        >
          <button
            onClick={onClose}
            className="btn-amber w-full justify-center"
            aria-label="Close and return to booking page"
          >
            Done <ArrowRight size={14} />
          </button>
          {isLive(restaurant.bookingUrl) && (
            <a
              href={restaurant.bookingUrl.value!}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full justify-center text-center"
            >
              View on Swiggy Dineout
            </a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function Book() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>("idle");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];

  // Shake animation on error fields
  const [shakeKey, setShakeKey] = useState(0);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = schema.safeParse(data);
    if (!res.success) {
      const fieldErrors = Object.fromEntries(
        res.error.issues.map((i) => [String(i.path[0]), i.message])
      );
      setErrors(fieldErrors);
      setShakeKey((k) => k + 1);
      // Focus first error field
      const first = res.error.issues[0]?.path[0] as string;
      if (first) {
        (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      }
      return;
    }

    setErrors({});
    setState("submitting");

    // Simulate submission delay — replace with real API call when available
    await new Promise((r) => setTimeout(r, 900));

    // Since online booking is not connected, this is a request — never fake confirmation.
    const d = res.data;
    setBooking({
      name: d.name,
      phone: d.phone,
      date: d.date,
      time: d.time,
      guests: String(d.guests),
      message: d.message ?? undefined,
    });
    setState("success");
    setShowModal(true);
  };

  const handleClose = useCallback(() => {
    setShowModal(false);
    // Give exit animation time to play then reset
    setTimeout(() => {
      setState("idle");
      setBooking(null);
    }, 400);
  }, []);

  const isSubmitting = state === "submitting";

  const field =
    "w-full border-b bg-transparent py-3 text-lg outline-none transition-colors focus:border-amber";
  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <motion.p
        key={shakeKey}
        className="mt-1.5 text-sm text-destructive"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: [0, -5, 5, -4, 4, 0] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        role="alert"
      >
        {errors[k]}
      </motion.p>
    ) : null;

  return (
    <>
      <section className="relative min-h-screen overflow-hidden pt-32">
        <div className="absolute -right-40 top-20 h-[600px] w-[600px] glow-amber" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-24 md:grid-cols-[1fr_1.2fr] md:px-8">
          {/* Left column — heading + character */}
          <div>
            <p className="eyebrow">Reservations</p>
            <h1 className="display-xl mt-5">
              Book a<br />
              <em className="normal-case text-amber">table.</em>
            </h1>
            <p className="mt-6 max-w-sm text-muted-foreground">
              Tell us when you're coming. Our host is already straightening the chairs.
            </p>
            <motion.div
              className="mt-10 hidden w-56 md:block"
              animate={
                state === "success"
                  ? { y: [-6, 0, -4, 0], transition: { duration: 0.8, times: [0, 0.35, 0.65, 1] } }
                  : { y: 0 }
              }
            >
              <Character mood={state === "success" ? "surprised" : "curious"} />
            </motion.div>
          </div>

          {/* Right column — form */}
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="grid gap-8 sm:grid-cols-2"
            aria-label="Table reservation form"
          >
            {/* Name */}
            <label className="sm:col-span-2">
              <span className="eyebrow">Name</span>
              <input
                name="name"
                className={field}
                autoComplete="name"
                aria-required="true"
                aria-describedby={errors['name'] ? "err-name" : undefined}
                aria-invalid={!!errors['name']}
              />
              <span id="err-name"><Err k="name" /></span>
            </label>

            {/* Phone */}
            <label className="sm:col-span-2">
              <span className="eyebrow">Phone</span>
              <input
                name="phone"
                type="tel"
                className={field}
                autoComplete="tel"
                aria-required="true"
                aria-describedby={errors['phone'] ? "err-phone" : undefined}
                aria-invalid={!!errors['phone']}
              />
              <span id="err-phone"><Err k="phone" /></span>
            </label>

            {/* Date */}
            <label>
              <span className="eyebrow">Date</span>
              <input
                name="date"
                type="date"
                min={today}
                className={field}
                aria-required="true"
                aria-describedby={errors['date'] ? "err-date" : undefined}
                aria-invalid={!!errors['date']}
              />
              <span id="err-date"><Err k="date" /></span>
            </label>

            {/* Time */}
            <label>
              <span className="eyebrow">Time</span>
              <input
                name="time"
                type="time"
                className={field}
                aria-required="true"
                aria-describedby={errors['time'] ? "err-time" : undefined}
                aria-invalid={!!errors['time']}
              />
              <span id="err-time"><Err k="time" /></span>
            </label>

            {/* Guests */}
            <label>
              <span className="eyebrow">Guests</span>
              <input
                name="guests"
                type="number"
                min={1}
                defaultValue={2}
                className={field}
                aria-required="true"
                aria-describedby={errors['guests'] ? "err-guests" : undefined}
                aria-invalid={!!errors['guests']}
              />
              <span id="err-guests"><Err k="guests" /></span>
            </label>

            {/* Message */}
            <label className="sm:col-span-2">
              <span className="eyebrow">Message (optional)</span>
              <textarea
                name="message"
                rows={3}
                className={field}
                placeholder="Birthday? Window seat? Tell us."
              />
            </label>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-amber justify-center sm:col-span-2"
              whileTap={{ scale: 0.97 }}
              aria-busy={isSubmitting}
              aria-label={isSubmitting ? "Submitting your reservation" : "Request a table"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Confirming your table...
                </>
              ) : (
                <>
                  Request table
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </section>

      {/* Confirmation modal — portal-like via AnimatePresence */}
      <AnimatePresence>
        {showModal && booking && (
          <ConfirmationModal booking={booking} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
}
