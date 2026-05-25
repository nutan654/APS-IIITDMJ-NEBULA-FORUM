import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, generateToken } from "@/lib/auth";
import { users } from "@/lib/db";

// Hardcoded Astronomy & Physics Council Quiz Answers
const QUIZ_ANSWERS = {
  q1: "general-relativity", // gravity is space-time curvature
  q2: "quantum-entanglement", // spooky action at a distance
  q3: "hawking-radiation", // black hole evaporation
  q4: "aperture", // most critical telescope spec
  q5: "chandrayaan-3", // ISRO south pole landing
};

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "You must sign in to petition the Council of Stars." }, { status: 401 });
    }

    const { answers } = await req.json();
    if (!answers) {
      return NextResponse.json({ error: "Missing challenge answers." }, { status: 400 });
    }

    let correctCount = 0;
    const totalQuestions = Object.keys(QUIZ_ANSWERS).length;

    for (const [key, value] of Object.entries(QUIZ_ANSWERS)) {
      if (answers[key] === value) {
        correctCount++;
      }
    }

    const scorePercentage = (correctCount / totalQuestions) * 100;
    const passed = scorePercentage >= 80;

    if (passed) {
      // Find the user record and update their role & title to SCHOLAR
      const userRecord = users.find((u) => u.id === user.id);
      if (userRecord) {
        userRecord.role = "SCHOLAR";
        userRecord.title = "Council Scholar";
      }

      // Generate a new JWT token to update cookie session info
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: "SCHOLAR",
      });

      const response = NextResponse.json({
        passed: true,
        score: scorePercentage,
        message: `Venerable Stargazer! You have answered ${correctCount}/${totalQuestions} coordinates correctly. The Council of Stars hereby elevates your rank to SCHOLAR!`,
        user: { ...user, role: "SCHOLAR", title: "Council Scholar" },
      });

      response.cookies.set({
        name: "nebula_session",
        value: token,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json({
        passed: false,
        score: scorePercentage,
        message: `Your calculations were imprecise (${correctCount}/${totalQuestions} correct). Gaze deeper into the heavens and commune again when the alignment is favorable.`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
