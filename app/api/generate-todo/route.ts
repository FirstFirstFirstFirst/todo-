import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const GOOGLE_GENERATIVE_AI_API_KEY =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    if (GOOGLE_GENERATIVE_AI_API_KEY === "") {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not found in .env file.");
      return;
    }
    const { todo } = await request.json();
    console.log("todo", todo);
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `Generate simple todo item from ${todo}. Keep it short and actionable.`,
      maxTokens: 50,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
