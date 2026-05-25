/**
 * In-Memory Data Store — replaces Prisma/SQLite entirely.
 * All data lives in memory and is pre-seeded at startup.
 * No database configuration needed.
 */

export interface User {
  id: number;
  email: string;
  password: string; // plain for demo — will compare directly
  name: string;
  role: "NOVICE" | "SCHOLAR" | "HIGH_PRIEST";
  title: string;
  createdAt: string;
}

export interface CelestialEvent {
  id: number;
  title: string;
  type: string;
  month: string;
  day: string;
  description: string;
  capacity: number;
  rsvps: number[]; // user IDs
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  tag: string;
  userId: number;
  authorName: string;
  authorTitle: string;
  likes: number;
  responsesCount: number;
  createdAt: string;
}

export interface TelescopeBooking {
  id: number;
  userId: number;
  userName: string;
  instrument: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: string;
}

export interface Astrophoto {
  id: number;
  title: string;
  url: string; // Dynamic simulated image preview URL
  userId: number;
  authorName: string;
  instrument: string;
  exposure: string;
  iso: number;
  createdAt: string;
}

export interface LogbookEntry {
  id: number;
  userId: number;
  authorName: string;
  date: string;
  object: string;
  skyConditions: string; // e.g. Perfect, Good, Hazy, Cloudy
  notes: string;
  eyepiece: string;
}

export interface KnowledgeItem {
  id: number;
  topic: string;
  keywords: string[];
  answer: string;
}

// ─── SEED DATA ───────────────────────────────────────────────

export const users: User[] = [
  { id: 1, email: "admin@nebula.aps", password: "nebula123", name: "Galileo Galilei", role: "HIGH_PRIEST", title: "High Celestial Priest", createdAt: new Date().toISOString() },
  { id: 2, email: "arjun@nebula.aps", password: "nebula123", name: "Arjun Verma", role: "SCHOLAR", title: "Astrophotographer Scholar", createdAt: new Date().toISOString() },
  { id: 3, email: "priya@nebula.aps", password: "nebula123", name: "Priya Sharma", role: "SCHOLAR", title: "Quantum Theorist", createdAt: new Date().toISOString() },
  { id: 4, email: "rohan@nebula.aps", password: "nebula123", name: "Rohan Mishra", role: "NOVICE", title: "Apprentice Observer", createdAt: new Date().toISOString() },
  { id: 5, email: "shreya@nebula.aps", password: "nebula123", name: "Shreya Agarwal", role: "SCHOLAR", title: "Deep Sky Scout", createdAt: new Date().toISOString() },
  { id: 6, email: "dev@nebula.aps", password: "nebula123", name: "Dev Pandey", role: "SCHOLAR", title: "Solar Sentry", createdAt: new Date().toISOString() },
];

export const events: CelestialEvent[] = [
  { id: 1, title: "Midnight Observatory Night", type: "Stargazing Session", month: "Jun", day: "06", description: "Open-air telescope session on the college grounds. Saturn and Jupiter visible with naked eye.", capacity: 30, rsvps: [] },
  { id: 2, title: "Introduction to Astrophotography", type: "Workshop", month: "Jun", day: "14", description: "Hands-on session with DSLR cameras, tracking mounts, and long-exposure techniques.", capacity: 25, rsvps: [] },
  { id: 3, title: "Solstice Symposium", type: "Summer Solstice", month: "Jun", day: "21", description: "Annual gathering on the longest day — lectures on solar astronomy, ancient calendars, and Stonehenge alignments.", capacity: 50, rsvps: [] },
  { id: 4, title: "Quantum Gravity & Space-Time", type: "Lecture", month: "Jul", day: "04", description: "Guest lecture exploring the intersection of quantum mechanics and general relativity, featuring black hole thermodynamics.", capacity: 40, rsvps: [] },
  { id: 5, title: "Perseids Meteor Shower Vigil", type: "Meteor Watch", month: "Aug", day: "12", description: "All-night observation session. Up to 100 meteors/hour at peak. Blankets, hot chai, and cosmic wonder provided.", capacity: 100, rsvps: [] },
  { id: 6, title: "Total Lunar Eclipse Watch", type: "Eclipse Event", month: "Sep", day: "07", description: "The Blood Moon rises. Collective observation with live commentary, mythology, and photography competition.", capacity: 80, rsvps: [] },
];

export const forumPosts: ForumPost[] = [
  { id: 1, title: "My first attempt at photographing the Orion Nebula — M42 through a 6-inch Newtonian", content: "Finally got a clear night from my backyard. Used a 6-inch Newtonian reflector on an EQ-5 tracking mount. 30 subs of 25 seconds each at ISO 800. Stacked in DeepSkyStacker and processed in Photoshop. Super happy with the core detail!", tag: "Astrophotography", userId: 2, authorName: "Arjun Verma", authorTitle: "Astrophotographer Scholar", likes: 12, responsesCount: 12, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 2, title: "Could Hawking Radiation be experimentally verified using analogue black holes in the lab?", content: "Reading a recent paper about using Bose-Einstein Condensates as sonic black hole analogues. By accelerating the fluid to supersonic speeds, phonons get trapped inside a sonic horizon. Do you think this can faithfully replicate actual Hawking radiation?", tag: "Theory", userId: 3, authorName: "Priya Sharma", authorTitle: "Quantum Theorist", likes: 27, responsesCount: 27, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, title: "What magnification is optimal for observing Saturn's ring gap (Cassini Division)?", content: "I tried observing Saturn last night using my Celestron NexStar 4SE. The seeing conditions were decent, but I couldn't resolve the Cassini Division at 53x. Should I upgrade to a 9mm or use a 2x Barlow lens?", tag: "Question", userId: 4, authorName: "Rohan Mishra", authorTitle: "Apprentice Observer", likes: 8, responsesCount: 8, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 4, title: "Observation log: spotted a 6th-magnitude variable star — possible nova candidate in Cygnus?", content: "While doing a routine sweep of Cygnus, I noticed an unusually bright point near RA 20h 14m, Dec +41° 12'. About 2 magnitudes brighter than cataloged. Could this be a classical nova in its early eruption phase?", tag: "Discovery", userId: 5, authorName: "Shreya Agarwal", authorTitle: "Deep Sky Scout", likes: 19, responsesCount: 19, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 5, title: "Celestial log: ISS transit across the Moon — photographed from campus rooftop, 00:34 hrs", content: "Managed to capture a split-second transit of the ISS across a 78% illuminated Moon. Block C rooftop offered perfect sightlines. Captured at 1/2000s shutter speed using a DSLR mounted prime-focus to the Dobsonian.", tag: "Observation", userId: 6, authorName: "Dev Pandey", authorTitle: "Solar Sentry", likes: 34, responsesCount: 34, createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
];

export const telescopeBookings: TelescopeBooking[] = [];

export const astrophotos: Astrophoto[] = [
  { id: 1, title: "Majestic Pillars of Creation", url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=600&auto=format&fit=crop", userId: 2, authorName: "Arjun Verma", instrument: "8-inch Dobsonian Reflector", exposure: "60 subs x 30s", iso: 1600, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 2, title: "Craters of the Crescent Moon", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop", userId: 6, authorName: "Dev Pandey", instrument: "Solar Observatory Refractor", exposure: "1/500s", iso: 200, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 3, title: "Andromeda Spiral (M31)", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop", userId: 5, authorName: "Shreya Agarwal", instrument: "Celestron NexStar 4SE", exposure: "120 subs x 20s", iso: 3200, createdAt: new Date(Date.now() - 10 * 86400000).toISOString() }
];

export const logbookEntries: LogbookEntry[] = [
  { id: 1, userId: 4, authorName: "Rohan Mishra", date: "2026-05-20", object: "Saturn and Ring Division", skyConditions: "Perfect", notes: "Excellent seeing. Used 9mm eyepiece on the Celestron 4SE. Resolved Cassini Division clearly for the first time!", eyepiece: "9mm Plössl" },
  { id: 2, userId: 5, authorName: "Shreya Agarwal", date: "2026-05-22", object: "Ring Nebula (M57)", skyConditions: "Good", notes: "Nebula appeared as a faint ghostly ring in Lyra. Higher magnification (10mm Dobsonian) made details pop.", eyepiece: "10mm Dobsonian Eyepiece" }
];

export const knowledgeBase: KnowledgeItem[] = [
  { id: 1, topic: "Relativity", keywords: ["relativity", "einstein", "gravity", "space-time", "time dilation", "general"], answer: "Einstein's Relativity is the grand canvas of the cosmos! Special Relativity dictates that space and time are bound together by the absolute speed of light. General Relativity reveals that gravity is not a force at all — but the curvature of space-time itself caused by mass and energy!" },
  { id: 2, topic: "Quantum Mechanics", keywords: ["quantum", "mechanics", "wave", "superposition", "entanglement", "uncertainty", "particle"], answer: "In the microscopic realm, nature behaves like a beautiful dream! Particles exist as probability clouds (superposition) until observed, behaving as both waves and particles simultaneously. Quantum entanglement links twin particles instantly across light-years — what Einstein called 'spooky action at a distance'!" },
  { id: 3, topic: "Black Holes", keywords: ["black hole", "singularity", "event horizon", "hawking", "collapse", "schwarzschild"], answer: "A black hole is gravity's absolute victory! When a massive star dies, its core collapses into an infinitely dense singularity. Beyond the Event Horizon, gravity is so extreme that not even light can escape. Yet they slowly evaporate through quantum Hawking Radiation over billions of years!" },
  { id: 4, topic: "Telescopes", keywords: ["telescope", "dobsonian", "refractor", "reflector", "magnification", "aperture", "eyepiece"], answer: "A Dobsonian reflector is ideal for deep-space nebulae and galaxies — massive light-gathering aperture at low cost! For crisp planetary detail of Saturn's rings and Jupiter's moons, a quality refractor like the Celestron NexStar is superb. Use 120-180x magnification on steady nights!" },
  { id: 5, topic: "Saturn", keywords: ["saturn", "rings", "cassini", "division", "gap", "barlow", "titan"], answer: "To resolve the Cassini Division in Saturn's rings, wait for a night of exceptional atmospheric seeing! Apply 120x to 180x magnification using a 9mm eyepiece or a quality Barlow lens. The dark gap between the A and B rings will appear as a razor-thin line of space!" },
  { id: 6, topic: "Observatory", keywords: ["observatory", "rooftop", "block c", "where", "location", "iiitdmj", "campus", "booking"], answer: "Our sacred sanctuary of the stars sits atop the rooftop of Block C at IIITDMJ! Every Friday night is designated for open telescope viewings. You can reserve the 8-inch Dobsonian or Celestron refractor through the Observatory booking form on this very page!" },
  { id: 7, topic: "ISRO", keywords: ["isro", "chandrayaan", "gaganyaan", "india", "mission", "rocket", "space agency"], answer: "ISRO — the Indian Space Research Organisation — stands as one of humanity's greatest scientific achievements! Chandrayaan-3 achieved a historic soft landing near the lunar south pole in 2023, making India only the 4th nation to land on the Moon. Gaganyaan will soon carry Indian astronauts to orbit!" },
  { id: 8, topic: "Exoplanets", keywords: ["exoplanet", "planet", "kepler", "james webb", "jwst", "habitable", "life"], answer: "Over 5,700 confirmed exoplanets now orbit distant stars! The James Webb Space Telescope can analyze exoplanet atmospheres by studying starlight filtered through them during transit. Some candidates in the habitable zone — like TRAPPIST-1e — may harbor liquid water and perhaps life!" },
];

// ─── COUNTER FOR NEW IDs ──────────────────────────────────────
export let nextUserId = users.length + 1;
export let nextForumId = forumPosts.length + 1;
export let nextBookingId = 1;
export let nextPhotoId = astrophotos.length + 1;
export let nextLogbookId = logbookEntries.length + 1;

export const incrementUserId = () => nextUserId++;
export const incrementForumId = () => nextForumId++;
export const incrementBookingId = () => nextBookingId++;
export const incrementPhotoId = () => nextPhotoId++;
export const incrementLogbookId = () => nextLogbookId++;
