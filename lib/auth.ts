import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { users } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "cosmic-nebula-secret-key-1889-galileo";

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("nebula_session")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = users.find((u) => u.id === decoded.userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    createdAt: user.createdAt,
  };
}
