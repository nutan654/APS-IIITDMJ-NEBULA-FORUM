import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "This soul is unknown to the star charts. Check your email or register first." },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "The secret passphrase does not unlock this cosmic seal." },
        { status: 401 }
      );
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: `Welcome back, ${user.name}! The observatory awaits.`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, title: user.title },
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
