import { NextRequest, NextResponse } from "next/server";
import { telescopeBookings, incrementBookingId } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const sorted = [...telescopeBookings].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.timeSlot.localeCompare(b.timeSlot);
    });

    const formattedBookings = sorted.map((b) => ({
      id: b.id,
      name: b.userName,
      instrument: b.instrument,
      date: b.date,
      timeSlot: b.timeSlot,
      purpose: b.purpose,
      status: b.status,
    }));

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    console.error("❌ GET bookings error:", error);
    return NextResponse.json(
      { error: "Failed to query the observatory ledger." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must reside within the fellowship to book telescopes." },
        { status: 401 }
      );
    }

    const { instrument, date, timeSlot, purpose } = await req.json();
    if (!instrument || !date || !timeSlot || !purpose) {
      return NextResponse.json(
        { error: "Missing parameters: instrument, date, slot, or observation purpose." },
        { status: 400 }
      );
    }

    const existingConflict = telescopeBookings.find(
      (b) =>
        b.instrument === instrument &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status === "APPROVED"
    );

    if (existingConflict) {
      return NextResponse.json(
        {
          error: `Clash detected! The '${instrument}' is already reserved for this slot by ${
            existingConflict.userId === user.id ? "yourself" : "another astronomer"
          }.`,
        },
        { status: 409 }
      );
    }

    const newBooking = {
      id: incrementBookingId(),
      userId: user.id,
      userName: user.name,
      instrument,
      date,
      timeSlot,
      purpose,
      status: "APPROVED",
    };

    telescopeBookings.push(newBooking);

    return NextResponse.json(
      {
        message: "Astronomical coordinates locked! Your booking is secured.",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ POST booking error:", error);
    return NextResponse.json(
      { error: "Failed to record telescope reservation in the ledger." },
      { status: 500 }
    );
  }
}
