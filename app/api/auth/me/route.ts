import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user });
}
