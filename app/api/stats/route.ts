import { NextRequest, NextResponse } from "next/server";
import { users, events, forumPosts, telescopeBookings } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    members: users.length,
    events: events.length,
    forumPosts: forumPosts.length,
    bookings: telescopeBookings.filter((b) => b.status === "CONFIRMED").length,
    totalRsvps: events.reduce((sum, e) => sum + e.rsvps.length, 0),
  });
}
