// Central content store. Every business fact carries a status.
// CONFIRMED -> published. UNCONFIRMED / CONFLICTING -> shown as a labelled placeholder.
export type Status = "CONFIRMED" | "UNCONFIRMED" | "CONFLICTING";
export type Fact<T = string> = { value: T | null; status: Status };

export const restaurant = {
  name: "Mr Bean Rooftop Restaurant",
  short: "Mr Bean Rooftop",
  tagline: "Good food. Great views. Unexpected moments.",
  address: {
    value: "Plot No. 20A, First Floor, Lake View Road, Senthuran Colony, Ayyappan Nagar, Madipakkam, Chennai – 600091",
    status: "CONFIRMED",
  } as Fact,
  landmark: { value: "Near Lake Park, Madipakkam", status: "CONFIRMED" } as Fact,
  phone: { value: null, status: "UNCONFIRMED" } as Fact,
  whatsapp: { value: null, status: "UNCONFIRMED" } as Fact,
  hours: {
    value: "Monday – Sunday · 12:00 PM – 1:00 AM",
    status: "CONFLICTING",
  } as Fact,
  hoursNote: {
    value: "Some listings show opening at 3:00 PM. Call ahead to confirm.",
    status: "CONFIRMED",
  } as Fact,
  bookingMethod: {
    value: "Reserve via Swiggy Dineout",
    status: "CONFIRMED",
  } as Fact,
  bookingUrl: {
    value: "https://www.swiggy.com/restaurants/mr-bean-rooftop-restaurant-madipakkam-chennai-1381851/dineout",
    status: "CONFIRMED",
  } as Fact,
  mapEmbedUrl: {
    value: "https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Mr+Bean+Rooftop+Restaurant,Madipakkam,Chennai",
    status: "UNCONFIRMED",
  } as Fact,
  dietary: { value: "100% Pure Veg", status: "CONFIRMED" } as Fact,
  avgCost: { value: "₹400 for two", status: "CONFIRMED" } as Fact,
  cuisine: { value: "Indo-Chinese · Continental · North Indian", status: "CONFIRMED" } as Fact,

  // Ratings
  googleRating: { value: "4.8 – 5.0 (16–27 reviews)", status: "CONFIRMED" } as Fact,
  justdialRating: { value: "4.8 – 5.0 (16–21 reviews)", status: "CONFIRMED" } as Fact,
  swiggydineoutRating: { value: "5.0 (27 reviews)", status: "CONFIRMED" } as Fact,

  // Seating
  rooftopSeating: { value: "Available — open-air rooftop terrace", status: "CONFIRMED" } as Fact,
  indoorSeating: { value: "Available — AC indoor family rooms", status: "CONFIRMED" } as Fact,
  partyHall: { value: "Available — capacity unconfirmed", status: "CONFLICTING" } as Fact,

  // Parking
  parking: { value: "Available", status: "CONFIRMED" } as Fact,
  parkingDetail: { value: null, status: "UNCONFIRMED" } as Fact,

  // Entertainment
  liveMusic: { value: "Live music & dancing reported by guests", status: "CONFLICTING" } as Fact,
  liveMusicSchedule: { value: null, status: "UNCONFIRMED" } as Fact,
  gaming: { value: null, status: "UNCONFIRMED" } as Fact,
};

export const isLive = (f: Fact<unknown>) => f.status === "CONFIRMED" && f.value != null;
export const isConflicting = (f: Fact<unknown>) => f.status === "CONFLICTING";
