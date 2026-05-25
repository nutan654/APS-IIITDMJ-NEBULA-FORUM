import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "You must be a member of NEBULA to register." }, { status: 401 });
  }
  const eventId = parseInt(params.id);
  const event = events.find((e) => e.id === eventId);
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  if (event.rsvps.includes(user.id)) {
    return NextResponse.json({ error: "You have already registered for this celestial gathering." }, { status: 400 });
  }
  if (event.rsvps.length >= event.capacity) {
    return NextResponse.json({ error: "This event has reached maximum celestial capacity." }, { status: 400 });
  }

  event.rsvps.push(user.id);
  return NextResponse.json({ message: `Your place under the stars is reserved, ${user.name}!`, rsvpCount: event.rsvps.length });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const eventId = parseInt(params.id);
  const event = events.find((e) => e.id === eventId);
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const idx = event.rsvps.indexOf(user.id);
  if (idx === -1) return NextResponse.json({ error: "You are not registered for this event." }, { status: 400 });

  event.rsvps.splice(idx, 1);
  return NextResponse.json({ message: "Your registration has been withdrawn from the celestial ledger.", rsvpCount: event.rsvps.length });
}
