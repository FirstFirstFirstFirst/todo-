import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { text, completed, imageUrl } = await request.json();
    const todo = await prisma.todo.update({
      where: {
        id: params.id,
      },
      data: {
        text,
        completed,
        imageUrl,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// await prisma.todo.delete({

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await prisma.todo.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({
      message: `Todo deleted with ID: ${todo.id}`,
      todo, 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
