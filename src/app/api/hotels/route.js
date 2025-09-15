import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    
    let page = searchParams.get("page");
    let limit = searchParams.get("limit");
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    const skip = (page - 1) * limit;

    const total = await collections.hotels.countDocuments();
    const hotels = await collections.hotels
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        success: true,
        hotels,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting hotel:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get hotels" },
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

    if (verifyToken.user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden access: Admin only route" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      name,
      location,
      totalRooms,
      pricePerNight,
      amenities,
      images,
      description,
      addedAt,
    } = body;

    if (!name || !location || !totalRooms || !pricePerNight || !description) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // ✅ Insert hotel data
    const result = await collections.hotels.insertOne({
      name,
      location,
      totalRooms,
      pricePerNight,
      amenities: amenities || [],
      images: images || [],
      description,
      addedAt,
      bookedRooms: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Hotel added successfully",
        hotelId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding hotel:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add hotel" },
      { status: 500 }
    );
  }
}