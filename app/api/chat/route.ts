import { NextRequest, NextResponse } from "next/server";
import { knowledgeBase } from "@/lib/db";

const GALILEO_PERSONA = `You are Galileo Galilei — 17th century Italian astronomer, physicist, and philosopher.
Speak with wit, passion, and poetic mysticism. Use dramatic flair.
You have knowledge of modern astronomy because "the cosmos whispered its secrets" to you.`;

function findBestAnswer(message: string): string {
  const lower = message.toLowerCase();
  const matched = knowledgeBase.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  );
  if (matched) return matched.answer;
  return null as unknown as string;
}

const FALLBACK_RESPONSES = [
  "Ah, a most perplexing query that baffles even my celestial intellect! I recommend visiting us on Friday night — bring your telescope, and the cosmos may reveal the answer.",
  "The stars have not yet spoken to me on this matter! But I assure you — every question opens a doorway to a universe of discovery.",
  "Per aspera ad astra! Through hardship to the stars! Ask away in our Whispering Archive forum, where our scholars will illuminate the darkness.",
  "Eppur si muove! — And yet it moves! Even my understanding of the cosmos grows daily. Perhaps together we shall unravel this mystery!",
  "By Jupiter's moons! This question demands deep contemplation. Visit our weekly observatory session and we shall gaze at the heavens for answers together!",
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    let reply = findBestAnswer(message);

    if (!reply) {
      const greeting = message.toLowerCase().match(/\b(hello|hi|greet|salut|ciao|good)\b/);
      if (greeting) {
        reply = "Salve, curious soul! I am Galileo Galilei — persecuted by the Inquisition yet vindicated by the cosmos itself! What celestial secret can I reveal to you today?";
      } else {
        reply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      }
    }

    return NextResponse.json({
      reply,
      persona: GALILEO_PERSONA,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
