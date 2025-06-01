import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const todos = await prisma.todo.findMany();
    const todos = await prisma.todo.findMany({
      orderBy: {
        text: "asc",
      },
    });
    // console.log("hello server");
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("/api/todo method POST being called");
    console.log("request", request);
    // console.log("request.json()", request.json());
    // const jsonResponse = request.json();
    // const { text, imageUrl } = await jsonResponse;
    const { text, imageUrl } = await request.json();
    // console.log("successfully retrieved text and imageUrl", jsonResponse);
    console.log("text, imageUrl", text, imageUrl);
    const todo = await prisma.todo.create({
      data: {
        text,
        imageUrl,
        completed: false,
      },
    });
    console.log("todo", todo)
    return NextResponse.json(todo);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
