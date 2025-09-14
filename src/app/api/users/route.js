import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";

export async function GET(req) {
  try {
    const result = verifyJwt();
    if (result.error) {
      return NextResponse.json(
        { authenticated: false, message: result.error },
        { status: 401 }
      );
    }

    if (result.user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden access: Admin only route" },
        { status: 403 }
      );
    }

    const { searchParams } = req.nextUrl;

    let page = searchParams.get("page");
    let limit = searchParams.get("limit");
    let search = searchParams.get("search");
    let searchType = searchParams.get("searchType");
    let role = searchParams.get("role");

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      if (searchType === "email") {
        query.email = regex;
      } else {
        query.name = regex;
      }
    }

    if (role && role !== "") {
      query.role = role;
    }

    const skip = (page - 1) * limit;
    const total = await collections.users.countDocuments(query);
    const users = await collections.users
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const response = NextResponse.json(
      {
        users,
        total,
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