import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

// GET all active telescope bookings
export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.telescopeBooking.findMany({
      include: {
        user: {
          select: {
            name: true,
            title: true,
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { timeSlot: "asc" },
      ],
    });

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      name: b.user.name,
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

// POST: Book a new telescope slot with full clash detection
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

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

    // Clash detection: Is this specific instrument already booked at this date + timeslot?
    const existingConflict = await prisma.telescopeBooking.findFirst({
      where: {
        instrument,
        date,
        timeSlot,
        status: "APPROVED",
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        {
          error: `Clash detected! The '${instrument}' is already reserved for this slot by ${
            existingConflict.userId === user.id ? "yourself" : "another astronomer"
          }.`,
        },
        { status: 409 } // Conflict
      );
    }

    // Create the booking
    const newBooking = await prisma.telescopeBooking.create({
      data: {
        userId: user.id,
        instrument,
        date,
        timeSlot,
        purpose,
        status: "APPROVED",
      },
    });

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
