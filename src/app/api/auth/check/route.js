import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";

export async function GET(req) {
  try {
    // Verify JWT
    const result = verifyJwt();
    if (result.error) {
      return NextResponse.json(
        { authenticated: false, message: result.error },
        { status: 401 }
      );
    }

    const {password, ...user} = await collections.users.findOne({ email: result.user.email });

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { authenticated: false, message: "Server error" },
      { status: 500 }
    );
  }
}