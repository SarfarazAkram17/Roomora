import { verifyJwt } from "@/lib/auth";
import collections from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const hotel = await collections.hotels.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(
      {
        success: true,
        hotel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error getting hotel:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get hotel" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
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

    const { id } = await params;
    const body = await req.json();
    const {
      name,
      location,
      totalRooms,
      pricePerNight,
      amenities,
      description,
      updatedAt,
      imagesToAdd = [],
      imagesToRemove = [],
    } = body;

    const query = { _id: new ObjectId(id) };
    const hotel = await collections.hotels.findOne(query);

    if (!hotel) {
      return NextResponse.json(
        {
          success: true,
          message: "Hotel not found",
        },
        { status: 404 }
      );
    }

    const update1 = {
      $set: {
        name,
        location,
        totalRooms,
        pricePerNight,
        amenities,
        description,
        updatedAt,
      },
    };

    if (imagesToRemove.length > 0) {
      update1.$pull = {
        images: { $in: imagesToRemove },
      };
    }

    await collections.hotels.updateOne(query, update1);

    // Step 2: Apply $push (if any)
    if (imagesToAdd.length > 0) {
      const update2 = {
        $push: {
          images: { $each: imagesToAdd },
        },
      };
      await collections.hotels.updateOne(query, update2);
    }

    return NextResponse.json(
      { success: true, message: "Product updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update hotel" },
      { status: 500 }
    );
  }
}

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
