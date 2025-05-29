import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api-error";
import { createUserUseCase, getAllUsersUseCase } from "@/application/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await createUserUseCase(body);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, details: error.details ?? null },
        { status: error.statusCode }
      );
    }

    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const search = url.searchParams.get("search") || "";

    if (page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    const { users, total } = await getAllUsersUseCase(page, search);

    return NextResponse.json({
      users,
      page,
      total,
      totalPages: Math.ceil(total / 5),
    });
  } catch (error) {
    console.error("Failed to get users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
