import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  const formatted = events.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    month: e.month,
    day: e.day,
    description: e.description,
    capacity: e.capacity,
    rsvpCount: e.rsvps.length,
    isRegistered: user ? e.rsvps.includes(user.id) : false,
  }));
  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== "HIGH_PRIEST") {
    return NextResponse.json({ error: "Only the High Celestial Priest can schedule events." }, { status: 403 });
  }
  const { title, type, month, day, description, capacity } = await req.json();
  if (!title || !type || !month || !day || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const newEvent = { id: events.length + 1, title, type, month, day, description, capacity: capacity || 30, rsvps: [] };
  events.push(newEvent);
  return NextResponse.json({ message: "Event scheduled!", event: newEvent }, { status: 201 });
}
