import { NextResponse } from "next/server";
import collections from "@/lib/db";
import { verifyJwt } from "@/lib/auth";
import { ObjectId } from "mongodb";

// export async function GET(req) {
//   try {
//     const verifyToken = verifyJwt();
//     if (verifyToken.error) {
//       return NextResponse.json(
//         { authenticated: false, message: verifyToken.error },
//         { status: 401 }
//       );
//     }

//     if (verifyToken.user.role !== "user") {
//       return NextResponse.json(
//         { message: "Forbidden access: user only route" },
//         { status: 403 }
//       );
//     }

//     const bookingData = await req.json();
//     const result = await collections.bookings.insertOne(bookingData);

//     return NextResponse.json({ success: true, bookingId: result.insertedId }, {status: 201});
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: error.message || "Booking failed" },
//       { status: 500 }
//     );
//   }
// }

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

    const hotelQuery = { _id: new ObjectId(bookingData.hotelId) }
    const hotel = await collections.hotels.findOne(hotelQuery)
    const updateHotelDoc = {
      $set: {
        bookedRooms: hotel.bookedRooms + bookingData.rooms,
      },
    };

    const updateBookedRoomsInHotel = await collections.hotels.updateOne(
      hotelQuery,
      updateHotelDoc
    );

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