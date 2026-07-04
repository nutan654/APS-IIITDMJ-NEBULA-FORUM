import { NextRequest, NextResponse } from "next/server";
import { forumPosts } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to appreciate a starry whisper." },
        { status: 401 }
      );
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required to record resonance." },
        { status: 400 }
      );
    }

    const post = forumPosts.find((p) => p.id === Number(postId));
    if (!post) {
      return NextResponse.json(
        { error: "This whisper has faded from the stellar coordinates." },
        { status: 404 }
      );
    }

    post.likes += 1;

    return NextResponse.json({
      message: "Resonance registered with the stars.",
      likes: post.likes,
    });
  } catch (error: any) {
    console.error("❌ Like post error:", error);
    return NextResponse.json(
      { error: "Failed to record your appreciation." },
      { status: 500 }
    );
  }
}
