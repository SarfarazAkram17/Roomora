import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";

export async function GET(req) {
  try {
    // Get email from query string
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Verify JWT
    const result = verifyJwt(email);

    if (result.error) {
      return NextResponse.json(
        { authenticated: false, message: result.error },
        { status: 401 }
      );
    }

    const { password, ...user } = await collections.users.findOne({ email });

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