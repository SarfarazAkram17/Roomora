import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";
import { NextResponse } from "next/server";

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
      createdAt,
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
      createdAt,
      bookedRooms: 0
    });

    return NextResponse.json(
      { success: true, message: "Hotel added successfully", hotelId: result.insertedId },
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