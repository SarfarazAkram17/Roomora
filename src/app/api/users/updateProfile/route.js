import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";

export async function PATCH(req) {
  try {
    const result = verifyJwt();
    if (result.error) {
      return NextResponse.json(
        { authenticated: false, message: result.error },
        { status: 401 }
      );
    }

    const { photo, name, email } = await req.json();

    // 1. Basic validation
    if (!photo || !name) {
      return NextResponse.json(
        { message: "Name, photo are required" },
        { status: 400 }
      );
    }

    const updatedUser = {
      $set: {
        photo,
        name,
        updatedAt: new Date().toISOString(),
      },
    };

    await collections.users.updateOne({ email }, updatedUser);

    const user = await collections.users.findOne({ email });

    // 6. Send token in HttpOnly cookie
    const response = NextResponse.json(
      {
        message: "Profile updated successfully",
        user,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Profile update Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}