import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { role, ...body } = await req.json();

    const result = verifyJwt();
    if (result.error) {
      return NextResponse.json(
        { authenticated: false, message: result.error },
        { status: 401 }
      );
    }

    if (role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden access: Admin only route" },
        { status: 403 }
      );
    }

    const updatedBooking = await collections.bookings.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    const response = NextResponse.json(
      {
        message: "Booking updated successfully",
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Booking update Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}