import { NextResponse } from "next/server";
import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    console.log("/api/generate-response method POST being called");

    const GOOGLE_GENERATIVE_AI_API_KEY =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    if (GOOGLE_GENERATIVE_AI_API_KEY === "") {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not found in .env file.");
      return;
    }

    const { messages } = await request.json();
    console.log("message", messages);
    const result = await streamText({
      model: google("models/gemini-2.0-flash"),
      messages,
    });
    // const { text } = await generateText({
    //   model: google("models/gemini-2.0-flash"),
    //   messages,
    // });
    console.log("text", result.text);
    // return NextResponse.json(text);
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
