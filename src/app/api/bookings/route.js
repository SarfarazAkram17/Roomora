import { NextResponse } from "next/server";
import collections from "@/lib/db";
import { verifyJwt } from "@/lib/auth";
import { ObjectId } from "mongodb";

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
    let status = searchParams.get("status");
    let search = searchParams.get("search");

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const query = {};

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
      .sort({ bookedAt: -1 })
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

export async function POST(req) {
  try {
    const verifyToken = verifyJwt();
    if (verifyToken.error) {
      return NextResponse.json(
        { authenticated: false, message: verifyToken.error },
        { status: 401 }
      );
    }

    if (verifyToken.user.role !== "user") {
      return NextResponse.json(
        { message: "Forbidden access: user only route" },
        { status: 403 }
      );
    }

    const bookingData = await req.json();
    const result = await collections.bookings.insertOne(bookingData);

    return NextResponse.json(
      { success: true, bookingId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Booking failed" },
      { status: 500 }
    );
  }
}