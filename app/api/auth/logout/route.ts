import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Farewell, stargazer. May the cosmos guide your path." });
  response.cookies.set({ name: "nebula_session", value: "", maxAge: 0, path: "/" });
  return response;
}
