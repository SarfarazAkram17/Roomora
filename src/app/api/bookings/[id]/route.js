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

    const body = await req.json();
    
    if (body.email !== result.user.email) {
    }
    
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
