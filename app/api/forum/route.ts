import { NextRequest, NextResponse } from "next/server";
import { forumPosts, incrementForumId } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const sorted = [...forumPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "You must be a NEBULA member to post in the Whispering Archive." }, { status: 401 });
  }
  const { title, content, tag } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const newPost = {
    id: incrementForumId(),
    title,
    content,
    tag: tag || "General",
    userId: user.id,
    authorName: user.name,
    authorTitle: user.title,
    likes: 0,
    responsesCount: 0,
    createdAt: new Date().toISOString(),
  };

  forumPosts.push(newPost);
  return NextResponse.json({ message: "Your whisper has been inscribed in the Archive.", post: newPost }, { status: 201 });
}
