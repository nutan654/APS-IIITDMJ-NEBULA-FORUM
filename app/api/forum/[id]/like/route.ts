import { NextRequest, NextResponse } from "next/server";
import { forumPosts } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const postId = parseInt(params.id);
  const post = forumPosts.find((p) => p.id === postId);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  post.likes += 1;
  return NextResponse.json({ message: "Celestial appreciation recorded!", likes: post.likes });
}
