import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const result = verifyJwt();
    if (result.error) {
      return NextResponse.json(
        { authenticated: false, message: result.error },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;

    let page = searchParams.get("page");
    let limit = searchParams.get("limit");
    let status = searchParams.get("status");
    let search = searchParams.get("search");

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const query = { userEmail: result.user.email };

    const today = new Date();
    query.checkIn = { $gt: today.toISOString() };

    if (search) {
      const regex = new RegExp(search, "i");
      query.hotelName = regex;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await collections.bookings.countDocuments(query);
    const bookings = await collections.bookings
      .find(query)
      .sort({ checkIn: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const response = NextResponse.json(
      {
        bookings,
        total,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("bookings getting Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}