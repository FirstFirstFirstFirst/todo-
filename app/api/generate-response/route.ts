import { NextResponse } from "next/server";
import {
  GoogleGenAI,
  GoogleGenAIOptions,
  createPartFromUri,
  createUserContent,
} from "@google/genai";

// export async function POST(request: Request) {
//   try {
//     console.log("/api/generate-response method POST being called");

//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
//     if (GEMINI_API_KEY === "") {
//       console.error("GEMINI_API_KEY not found in .env file.");
//       return;
//     }

//     const { message } = await request.json();
//     const options: GoogleGenAIOptions = {
//       apiKey: GEMINI_API_KEY,
//     };

//     const ai = new GoogleGenAI(options);

//     const modelName = "gemini-2.0-flash-001";
//     // const doc = await ai.files.upload({
//     //   file: "cachedContent.txt",
//     //   config: { mimeType: "text/plain" },
//     // });
//     // console.log("Uploaded file name:", doc.name);

//     // const cache = await ai.caches.create({
//     //   model: modelName,
//     //   config: {
//     //     contents: createUserContent(
//     //       createPartFromUri(doc.uri as string, doc.mimeType as string)
//     //     ),
//     //     systemInstruction:
//     //       "You are my assistant. Your name is Jarvis. Your answer will contain content that easily visualize with react markdown.",
//     //   },
//     // });
//     // console.log("Cache created:", cache);
//     const response = await ai.models.generateContent({
//       model: modelName,
//       contents: message,
//       // config: { cachedContent: cache.name },
//     });
//     console.log("Response text:", response.text);

//     console.log("response", JSON.stringify(response));
//     return NextResponse.json(response.text);
//   } catch (error) {
//     console.log("error", error);
//     return NextResponse.json(
//       { error: "Failed to generate response" },
//       { status: 500 }
//     );
//   }
// }


export async function POST(request: Request) {
  try {
    console.log("/api/generate-response method POST being called");

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
    if (GEMINI_API_KEY === "") {
      console.error("GEMINI_API_KEY not found in .env file.");
      return;
    }

    const { message } = await request.json();
    const options: GoogleGenAIOptions = {
      apiKey: GEMINI_API_KEY,
    };

    const ai = new GoogleGenAI(options);

    const modelName = "gemini-2.0-flash-001";
    // const doc = await ai.files.upload({
    //   file: "cachedContent.txt",
    //   config: { mimeType: "text/plain" },
    // });
    // console.log("Uploaded file name:", doc.name);

    // const cache = await ai.caches.create({
    //   model: modelName,
    //   config: {
    //     contents: createUserContent(
    //       createPartFromUri(doc.uri as string, doc.mimeType as string)
    //     ),
    //     systemInstruction:
    //       "You are my assistant. Your name is Jarvis. Your answer will contain content that easily visualize with react markdown.",
    //   },
    // });
    // console.log("Cache created:", cache);
    const response = await ai.models.generateContent({
      model: modelName,
      contents: message,
      // config: { cachedContent: cache.name },
    });
    console.log("Response text:", response.text);

    console.log("response", JSON.stringify(response));
    return NextResponse.json(response.text);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
