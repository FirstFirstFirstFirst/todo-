import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    message: `Hello from GET! but in id: [${params.id}]`,
  });
}
