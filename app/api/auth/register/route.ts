import { NextRequest, NextResponse } from "next/server";
import { users, incrementUserId } from "@/lib/db";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide name, email, and password." },
        { status: 400 }
      );
    }

    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { error: "A stargazer with this email already exists in the star charts." },
        { status: 400 }
      );
    }

    // Determine role from email domain
    let role: "NOVICE" | "SCHOLAR" | "HIGH_PRIEST" = "NOVICE";
    let title = "Novice Stargazer";
    if (email.endsWith("@nebula.aps")) {
      role = "SCHOLAR";
      title = "Astrophysical Scholar";
    }

    const newUser = {
      id: incrementUserId(),
      email,
      password, // plain text for in-memory demo
      name,
      role,
      title,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

    const response = NextResponse.json({
      message: `Welcome to the NEBULA Fellowship, ${name}!`,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, title: newUser.title },
    }, { status: 201 });

    response.cookies.set({ name: "nebula_session", value: token, httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
