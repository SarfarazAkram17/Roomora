import collections from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const hotels = await collections.hotels
      .aggregate([{ $sample: { size: 4 } }])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        hotels,
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