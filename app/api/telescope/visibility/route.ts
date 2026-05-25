import { NextRequest, NextResponse } from "next/server";
import { getPlanetVisibility } from "@/lib/astronomy";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date") || undefined;

    const data = getPlanetVisibility(dateParam);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read orbital alignments." },
      { status: 500 }
    );
  }
}
