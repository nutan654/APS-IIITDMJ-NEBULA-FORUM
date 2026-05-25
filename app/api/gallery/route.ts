import { NextRequest, NextResponse } from "next/server";
import { astrophotos, incrementPhotoId } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const sorted = [...astrophotos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "You must be authenticated to upload astrophotography." }, { status: 401 });
    }

    const { title, url, instrument, exposure, iso } = await req.json();

    if (!title || !url) {
      return NextResponse.json({ error: "Please provide a title and image url/preview link." }, { status: 400 });
    }

    const newPhoto = {
      id: incrementPhotoId(),
      title,
      url,
      userId: user.id,
      authorName: user.name,
      instrument: instrument || "Standard Telescope",
      exposure: exposure || "Single exposure",
      iso: iso ? parseInt(iso) : 800,
      createdAt: new Date().toISOString(),
    };

    astrophotos.push(newPhoto);

    return NextResponse.json({
      message: "Your cosmic masterpiece has been displayed in the gallery ledger!",
      photo: newPhoto,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
