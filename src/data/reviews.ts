/**
 * reviews.ts — Google review data adapter
 *
 * Architecture:
 *  - GoogleReview is the canonical type for real Google Places API data.
 *  - GOOGLE_PLACE_ID is the only thing that changes when live API is wired up.
 *  - mockGoogleReviews are clearly marked DEV placeholders — replace the array
 *    with a real API fetch once credentials are configured in the environment.
 *
 * To connect live Google reviews:
 *  1. Add VITE_GOOGLE_PLACES_API_KEY to your .env (never commit this key).
 *  2. Replace fetchGoogleReviews() with a real Places API (or Business Profile API) call.
 *  3. The UI consumes the same GoogleReview type, so no page changes are needed.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type GoogleReview = {
  /** Display name of the reviewer */
  reviewerName: string;
  /** URL to the reviewer's Google profile photo — null if unavailable */
  reviewerPhoto: string | null;
  /** Integer rating 1–5 */
  rating: number;
  /** The review text as written by the guest */
  comment: string;
  /** ISO 8601 date string e.g. "2024-10-01" */
  date: string;
  /** Direct link to this review on Google Maps */
  reviewUrl: string | null;
  /** Always "google" for this data type */
  source: "google";
};

export type GoogleSummary = {
  /** Aggregate rating (e.g. 4.8) */
  rating: number;
  /** Total number of reviews */
  totalReviews: number;
  /** Direct link to the restaurant's Google reviews listing */
  profileUrl: string | null;
};

// ── Google Place configuration ────────────────────────────────────────────────

/**
 * Replace with the verified Google Place ID once confirmed.
 * Find it at: https://developers.google.com/maps/documentation/places/web-service/place-id
 */
export const GOOGLE_PLACE_ID: string | null = null; // TODO: set verified Place ID

/**
 * Google Maps review listing URL — replace once the verified Place ID is known.
 * Format: https://search.google.com/local/reviews?placeid=<PLACE_ID>
 */
export const GOOGLE_REVIEWS_URL: string | null = null; // TODO: add verified URL

// ── Summary ───────────────────────────────────────────────────────────────────

/**
 * Aggregate rating summary — sourced from public listing data.
 * Status: CONFIRMED range from Google/Justdial/Swiggy Dineout cross-reference.
 * Update totalReviews once a single authoritative source is verified.
 */
export const googleSummary: GoogleSummary = {
  rating: 4.9,           // confirmed range: 4.8–5.0 across platforms
  totalReviews: 27,      // confirmed: up to 27 on Swiggy Dineout
  profileUrl: GOOGLE_REVIEWS_URL,
};

// ── DEV placeholder reviews ───────────────────────────────────────────────────
//
// ⚠️  DEVELOPMENT DATA — NOT real Google reviews.
//     These are structural placeholders to test the UI.
//     Replace this array with real API data before publishing.
//
export const mockGoogleReviews: GoogleReview[] = [
  {
    reviewerName: "Rooftop Guest",
    reviewerPhoto: null,
    rating: 5,
    comment:
      "Amazing rooftop ambience — loved the live music and the pure veg food was exceptional. One of the best dining experiences in Chennai.",
    date: "2024-09-15",
    reviewUrl: null,
    source: "google",
  },
  {
    reviewerName: "Rooftop Guest",
    reviewerPhoto: null,
    rating: 5,
    comment:
      "Perfect place for a birthday celebration. The rooftop view is breathtaking and the staff were wonderful. Highly recommended for special occasions.",
    date: "2024-08-22",
    reviewUrl: null,
    source: "google",
  },
  {
    reviewerName: "Rooftop Guest",
    reviewerPhoto: null,
    rating: 5,
    comment:
      "Best rooftop dining experience in Madipakkam. The food was delicious, the view was spectacular, and the ambience was perfect for a family dinner.",
    date: "2024-07-30",
    reviewUrl: null,
    source: "google",
  },
  {
    reviewerName: "Rooftop Guest",
    reviewerPhoto: null,
    rating: 5,
    comment:
      "The rooftop setting is truly magical at night. Great atmosphere, friendly service, and the food quality is consistently excellent.",
    date: "2024-07-10",
    reviewUrl: null,
    source: "google",
  },
  {
    reviewerName: "Rooftop Guest",
    reviewerPhoto: null,
    rating: 5,
    comment:
      "Celebrated our anniversary here and it was unforgettable. The rooftop under the stars, the warm lighting, and the warm service made it a perfect evening.",
    date: "2024-06-18",
    reviewUrl: null,
    source: "google",
  },
  {
    reviewerName: "Rooftop Guest",
    reviewerPhoto: null,
    rating: 5,
    comment:
      "Visited with friends and we all loved it. The rooftop view is stunning and the food was excellent throughout. Will definitely return.",
    date: "2024-05-25",
    reviewUrl: null,
    source: "google",
  },
];

/**
 * Data adapter — swap this to a live API call when ready.
 * Returns the mock data in development / when no Place ID is configured.
 */
export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  if (!GOOGLE_PLACE_ID || !import.meta.env['VITE_GOOGLE_PLACES_API_KEY']) {
    // No credentials configured — return dev placeholders.
    return Promise.resolve(mockGoogleReviews);
  }
  // TODO: implement real Google Places API call here.
  // Never expose the API key in client-side code — proxy via a server function.
  return Promise.resolve(mockGoogleReviews);
}
