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

    const user = await collections.users.findOne({ email: result.user.email });
    if (user.role !== "admin") {
      return NextResponse.json(
        {
          message: "You are not able to see admin stats",
        },
        { status: 403 }
      );
    }

    const totalBookings = await collections.bookings.countDocuments();
    const totalUsers = await collections.users.countDocuments();
    const totalHotels = await collections.hotels.countDocuments();
    const totalEarningsAgg = await collections.bookings
      .aggregate([
        { $match: { payment_status: "paid" } },
        { $group: { _id: null, totalEarnings: { $sum: "$totalPrice" } } },
      ])
      .toArray();
    const totalEarnings =
      totalEarningsAgg.length > 0 ? totalEarningsAgg[0].totalEarnings : 0;

    // --- Monthly Bookings ---
    const monthlyBookingsAgg = await collections.bookings
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%b %Y",
                date: { $toDate: "$bookedAt" },
              },
            },
            bookings: { $sum: 1 },
            firstDate: { $min: { $toDate: "$bookedAt" } },
          },
        },
      ])
      .toArray();

    // sort by actual date
    monthlyBookingsAgg.sort(
      (a, b) => new Date(a.firstDate) - new Date(b.firstDate)
    );

    const monthlyBookingsData = monthlyBookingsAgg.map((item) => ({
      month: item._id,
      bookings: item.bookings,
    }));

    // --- Monthly Payments ---
      const monthlyPaymentsAgg = await collections.bookings
        .aggregate([
          { $match: { payment_status: "paid" } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%b %Y",
                  date: { $toDate: "$paidAt" },
                },
              },
              payments: { $sum: "$totalPrice" },
              firstDate: { $min: { $toDate: "$paidAt" } },
            },
          },
        ])
        .toArray();

      monthlyPaymentsAgg.sort(
        (a, b) => new Date(a.firstDate) - new Date(b.firstDate)
      );

      const monthlyPaymentsData = monthlyPaymentsAgg.map((item) => ({
        month: item._id,
        payments: Number(item.payments),
      }));

    const stats = {
      totalBookings,
      totalUsers,
      totalHotels,
      totalEarnings,
      monthlyBookingsData,
      monthlyPaymentsData,
    };

    const response = NextResponse.json(
      {
        stats,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("stats getting Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}