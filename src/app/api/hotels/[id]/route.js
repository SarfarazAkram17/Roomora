import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = await params;

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

    // ✅ Insert hotel data
    const result = await collections.hotels.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Hotel deleted successfully",
        deletedCount: result.deletedCount,
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
