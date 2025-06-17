// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { UserEntity } from "@/entities/user/domain";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/entities/user/server";

function validateUserData(data: unknown): data is Omit<UserEntity, "id"> {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    obj.name.trim().length > 0 &&
    typeof obj.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email) &&
    typeof obj.age === "number" &&
    obj.age > 0 &&
    typeof obj.department === "string" &&
    obj.department.trim().length > 0 &&
    typeof obj.salary === "number" &&
    obj.salary >= 0
  );
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      const user = await getUserById(id);
      if (!user) {
        return NextResponse.json(
          { message: "Пользователь не найден" },
          { status: 404 },
        );
      }
      return NextResponse.json(user);
    }
    const users: UserEntity[] = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { message: "Не удалось получить данные" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!validateUserData(body)) {
      return NextResponse.json(
        { message: "Неверные данные пользователя" },
        { status: 400 },
      );
    }
    const newUser = await createUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { message: "Не удалось создать пользователя" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Не указан id пользователя" },
        { status: 400 },
      );
    }
    const body = await request.json();
    if (!validateUserData(body)) {
      return NextResponse.json(
        { message: "Неверные данные пользователя" },
        { status: 400 },
      );
    }
    const updated = await updateUser(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { message: "Не удалось обновить пользователя" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Не указан id пользователя" },
        { status: 400 },
      );
    }
    await deleteUser(id);
    return NextResponse.json({ message: "Пользователь удалён" });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { message: "Не удалось удалить пользователя" },
      { status: 500 },
    );
  }
}
