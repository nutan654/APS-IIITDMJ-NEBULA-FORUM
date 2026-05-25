import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌌 Clearing existing database...");
  await prisma.eventRSVP.deleteMany({});
  await prisma.forumPost.deleteMany({});
  await prisma.telescopeBooking.deleteMany({});
  await prisma.celestialEvent.deleteMany({});
  await prisma.knowledgeBase.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🔑 Creating password hashes...");
  const hashedPassword = await bcrypt.hash("nebula123", 10);

  console.log("👤 Creating celestial users...");
  const arjun = await prisma.user.create({
    data: {
      email: "arjun@nebula.aps",
      password: hashedPassword,
      name: "Arjun Verma",
      role: "SCHOLAR",
      title: "Astrophotographer Scholar",
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: "priya@nebula.aps",
      password: hashedPassword,
      name: "Priya Sharma",
      role: "SCHOLAR",
      title: "Quantum Theorist",
    },
  });

  const rohan = await prisma.user.create({
    data: {
      email: "rohan@nebula.aps",
      password: hashedPassword,
      name: "Rohan Mishra",
      role: "NOVICE",
      title: "Apprentice Observer",
    },
  });

  const shreya = await prisma.user.create({
    data: {
      email: "shreya@nebula.aps",
      password: hashedPassword,
      name: "Shreya Agarwal",
      role: "SCHOLAR",
      title: "Deep Sky Scout",
    },
  });

  const dev = await prisma.user.create({
    data: {
      email: "dev@nebula.aps",
      password: hashedPassword,
      name: "Dev Pandey",
      role: "SCHOLAR",
      title: "Solar Sentry",
    },
  });

  const highPriest = await prisma.user.create({
    data: {
      email: "admin@nebula.aps",
      password: hashedPassword,
      name: "Galileo Galilei",
      role: "HIGH_PRIEST",
      title: "High Celestial Priest",
    },
  });

  console.log("📅 Seeding Celestial Calendar events...");
  await prisma.celestialEvent.createMany({
    data: [
      {
        title: "Midnight Observatory Night",
        type: "Stargazing Session",
        month: "Jun",
        day: "06",
        description: "Open-air telescope session on the college grounds. Saturn and Jupiter visible with naked eye.",
        capacity: 30,
      },
      {
        title: "Introduction to Astrophotography",
        type: "Workshop",
        month: "Jun",
        day: "14",
        description: "Hands-on session with DSLR cameras, tracking mounts, and long-exposure techniques.",
        capacity: 25,
      },
      {
        title: "Solstice Symposium",
        type: "Summer Solstice",
        month: "Jun",
        day: "21",
        description: "Annual gathering on the longest day — lectures on solar astronomy, ancient calendars, and Stonehenge alignments.",
        capacity: 50,
      },
      {
        title: "Quantum Gravity & Space-Time",
        type: "Lecture",
        month: "Jul",
        day: "04",
        description: "Guest lecture exploring the intersection of quantum mechanics and general relativity, featuring black hole thermodynamics.",
        capacity: 40,
      },
      {
        title: "Perseids Meteor Shower Vigil",
        type: "Meteor Watch",
        month: "Aug",
        day: "12",
        description: "All-night observation session. Up to 100 meteors/hour at peak. Blankets, hot chai, and cosmic wonder provided.",
        capacity: 100,
      },
      {
        title: "Total Lunar Eclipse Watch",
        type: "Eclipse Event",
        month: "Sep",
        day: "07",
        description: "The Blood Moon rises. Collective observation with live commentary, mythology, and photography competition.",
        capacity: 80,
      },
    ],
  });

  console.log("📜 Seeding Starry Whispers forum posts...");
  await prisma.forumPost.createMany({
    data: [
      {
        title: "My first attempt at photographing the Orion Nebula — M42 through a 6-inch Newtonian",
        content: "Finally got a clear night from my backyard. Used a 6-inch Newtonian reflector on an EQ-5 tracking mount. 30 subs of 25 seconds each at ISO 800. Stacked in DeepSkyStacker and processed in Photoshop. Super happy with the core detail!",
        tag: "Astrophotography",
        userId: arjun.id,
        likes: 12,
        responsesCount: 12,
      },
      {
        title: "Could Hawking Radiation be experimentally verified using analogue black holes in the lab?",
        content: "Reading a recent paper about using Bose-Einstein Condensates as sonic black hole analogues. By accelerating the fluid to supersonic speeds, phonons get trapped inside a sonic horizon. Do you think this can faithfully replicate actual gravitational black hole Hawking radiation?",
        tag: "Theory",
        userId: priya.id,
        likes: 27,
        responsesCount: 27,
      },
      {
        title: "What magnification is optimal for observing Saturn's ring gap (Cassini Division)?",
        content: "I tried observing Saturn last night using my Celestron NexStar 4SE. The seeing conditions were decent, but I couldn't resolve the Cassini Division. I used a 25mm eyepiece (about 53x magnification). Should I upgrade to a 9mm or use a 2x Barlow lens?",
        tag: "Question",
        userId: rohan.id,
        likes: 8,
        responsesCount: 8,
      },
      {
        title: "Observation log: spotted a 6th-magnitude variable star — possible nova candidate in Cygnus?",
        content: "While doing a routine sweep of Cygnus, I noticed an unusually bright point of light near the coordinates RA 20h 14m, Dec +41° 12'. Checking star charts, it seems to be about 2 magnitudes brighter than cataloged values. Could this be a classic nova in its early eruption phase?",
        tag: "Discovery",
        userId: shreya.id,
        likes: 19,
        responsesCount: 19,
      },
      {
        title: "Celestial log: ISS transit across the Moon — photographed from campus rooftop, 00:34 hrs",
        content: "Managed to capture a split-second transit of the International Space Station across a 78% illuminated Moon. Block C rooftop offered perfect sightlines. Captured at 1/2000s shutter speed using a DSLR mounted prime-focus to the Dobsonian reflector.",
        tag: "Observation",
        userId: dev.id,
        likes: 34,
        responsesCount: 34,
      },
    ],
  });

  console.log("🤖 Seeding Galileo Bot knowledge archive...");
  await prisma.knowledgeBase.createMany({
    data: [
      {
        topic: "Relativity",
        keywords: "relativity,einstein,gravity,space-time,time dilation",
        question: "What is Relativity?",
        answer: "Einstein's Relativity is the grand canvas of the cosmos! Special Relativity dictates that space and time are bound relative to the observer by the absolute speed of light. General Relativity shows us that gravity is not a physical pull, but the curvature of the fabric of space-time itself under the pressure of massive celestial bodies!",
      },
      {
        topic: "Quantum Mechanics",
        keywords: "quantum,mechanics,wave,superposition,entanglement,spooky",
        question: "How does Quantum Mechanics work?",
        answer: "In the microscopic realm, nature behaves like a beautiful dream! Subatomic particles exist in a cloud of probabilities (superposition) until measured, behaving both as particles and waves. Quantum entanglement links twin particles instantly across light-years—what Einstein called 'spooky action at a distance'!",
      },
      {
        topic: "Black Holes",
        keywords: "black hole,singularity,event horizon,hawking,collapse",
        question: "What are Black Holes?",
        answer: "A black hole is gravity's absolute victory! When a gargantuan star dies, its matter collapses into an infinitely dense point—a singularity. Beyond the Event Horizon, gravity is so deep that not even light can escape its clutch. Yet, they slowly evaporate through quantum Hawking Radiation!",
      },
      {
        topic: "Telescopes",
        keywords: "telescope,dobsonian,refractor,reflector,magnification,aperture",
        question: "What telescope should I use?",
        answer: "A Dobsonian reflector is the ultimate instrument for exploring deep-space nebulas and galaxies because it offers massive light-gathering aperture at low cost! For crisp planetary viewing of Saturn's rings and Jupiter's moons, a high-quality glass Refractor like our Celestron NexStar is unparalleled.",
      },
      {
        topic: "Cassini Division",
        keywords: "saturn,rings,cassini,division,gap,barlow",
        question: "How do I see Saturn's Cassini Division?",
        answer: "To gaze upon the Cassini Division, you must wait for a night of excellent atmospheric 'seeing' where stars do not twinkle heavily! Align your telescope with Saturn high in the heavens and apply 120x to 150x magnification. A 9mm eyepiece combined with a quality Barlow lens will reveal the dark void separating the A and B rings.",
      },
      {
        topic: "IIITDMJ",
        keywords: "iiitdmj,college,campus,club,where,observatory",
        question: "Where is the NEBULA Observatory located?",
        answer: "Our sacred sanctuary of the stars is located atop the college rooftop of Block C at IIITDMJ! Weekly Friday nights are designated for public telescope viewings, where scholars guide stargazers through the lunar mountains and planetary rings under the dark Jabalpur skies.",
      },
    ],
  });

  console.log("🌌 Seed complete! The cosmos is in perfect harmony.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
