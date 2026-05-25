import { NextRequest, NextResponse } from "next/server";
import { telescopeBookings, incrementBookingId } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

const INSTRUMENTS = ["8-inch Dobsonian Reflector", "Celestron NexStar 4SE", "Solar Observatory Refractor"];
const SLOTS = ["18:00–19:30", "19:30–21:00", "21:00–22:30", "22:30–00:00", "00:00–01:30"];

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const userBookings = telescopeBookings.filter((b) => b.userId === user.id);
  return NextResponse.json({ bookings: userBookings, instruments: INSTRUMENTS, slots: SLOTS });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "You must be a member to book the observatory instruments." }, { status: 401 });
  }

  const { instrument, date, timeSlot, purpose } = await req.json();
  if (!instrument || !date || !timeSlot || !purpose) {
    return NextResponse.json({ error: "All booking fields are required." }, { status: 400 });
  }

  const clash = telescopeBookings.find((b) => b.instrument === instrument && b.date === date && b.timeSlot === timeSlot && b.status !== "CANCELLED");
  if (clash) {
    return NextResponse.json({ error: "This instrument is already reserved for this celestial time window." }, { status: 409 });
  }

  const newBooking = {
    id: incrementBookingId(),
    userId: user.id,
    userName: user.name,
    instrument,
    date,
    timeSlot,
    purpose,
    status: "CONFIRMED",
  };

  telescopeBookings.push(newBooking);
  return NextResponse.json({ message: `Observatory booking confirmed, ${user.name}! The cosmos awaits your gaze.`, booking: newBooking }, { status: 201 });
}
