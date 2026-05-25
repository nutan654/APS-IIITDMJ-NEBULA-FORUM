import { NextRequest, NextResponse } from "next/server";
import { logbookEntries, incrementLogbookId } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Filter logs only for the active stargazer
  const myEntries = logbookEntries.filter((e) => e.userId === user.id);
  return NextResponse.json(myEntries);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Sign in to log observations." }, { status: 401 });
    }

    const { date, object, skyConditions, eyepiece, notes } = await req.json();

    if (!date || !object || !skyConditions) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newEntry = {
      id: incrementLogbookId(),
      userId: user.id,
      authorName: user.name,
      date,
      object,
      skyConditions,
      notes: notes || "No specific details logged.",
      eyepiece: eyepiece || "Standard eyepiece",
    };

    logbookEntries.push(newEntry);

    return NextResponse.json({
      message: "Observation successfully recorded in your cosmic logbook!",
      entry: newEntry,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing entry ID." }, { status: 400 });

    const entryId = parseInt(id);
    const idx = logbookEntries.findIndex((e) => e.id === entryId && e.userId === user.id);

    if (idx === -1) {
      return NextResponse.json({ error: "Observation log not found." }, { status: 404 });
    }

    logbookEntries.splice(idx, 1);
    return NextResponse.json({ message: "Observation entry dissolved from the log." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
