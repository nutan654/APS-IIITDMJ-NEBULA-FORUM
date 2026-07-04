import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to RSVP for a celestial communion." },
        { status: 401 }
      );
    }

    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json(
        { error: "Celestial event ID is required." },
        { status: 400 }
      );
    }

    const event = events.find((e) => e.id === Number(eventId));
    if (!event) {
      return NextResponse.json(
        { error: "This celestial event does not exist on our star maps." },
        { status: 404 }
      );
    }

    const existingIndex = event.rsvps.indexOf(user.id);

    if (existingIndex !== -1) {
      event.rsvps.splice(existingIndex, 1);
      return NextResponse.json({
        message: `Your reservation for '${event.title}' has been dissolved.`,
        isRegistered: false,
      });
    } else {
      if (event.rsvps.length >= event.capacity) {
        return NextResponse.json(
          { error: "Alas! The observation deck is at full capacity for this event." },
          { status: 400 }
        );
      }
      event.rsvps.push(user.id);
      return NextResponse.json({
        message: `Clear skies! You have reserved a spot for '${event.title}'.`,
        isRegistered: true,
      });
    }
  } catch (error: any) {
    console.error("❌ RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to record your celestial reservation." },
      { status: 500 }
    );
  }
}
