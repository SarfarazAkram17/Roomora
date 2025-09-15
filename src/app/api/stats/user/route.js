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
    const email = searchParams.get("email");

    if (result.user.email !== email) {
      return NextResponse.json(
        {
          message: "You are not able to see other users stats",
        },
        { status: 403 }
      );
    }

    const today = new Date();
    const totalBookings = await collections.bookings.countDocuments({
      userEmail: email,
    });
    const cancelledBookings = await collections.bookings.countDocuments({
      userEmail: email,
      status: "cancelled",
    });
    const upcomingBookings = await collections.bookings.countDocuments({
      userEmail: email,
      status: { $ne: "cancelled" },
      checkIn: { $gt: today.toISOString() },
    });
    const totalSpentArray = await collections.bookings
      .aggregate([
        {
          $match: { userEmail: email, payment_status: "paid" },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$totalPrice" },
          },
        },
      ])
      .toArray();

    // Monthly Bookings
    const monthlyBookingsAgg = await collections.bookings
      .aggregate([
        { $match: { userEmail: email } },
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
    // Sort by date
    monthlyBookingsAgg.sort(
      (a, b) => new Date(a.firstDate) - new Date(b.firstDate)
    );
    const monthlyBookings = monthlyBookingsAgg.map((item) => ({
      month: item._id,
      bookings: item.bookings,
    }));

    // Monthly Payments
      const monthlyPaymentsAgg = await collections.bookings
        .aggregate([
          { $match: { userEmail: email, payment_status: "paid" } },
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
      const monthlyPayments = monthlyPaymentsAgg.map((item) => ({
        month: item._id,
        payments: Number(item.payments.toFixed(2)),
      }));

    const stats = {
      totalBookings,
      cancelledBookings,
      upcomingBookings,
      totalSpent: totalSpentArray[0]?.totalSpent || 0,
      monthlyBookings,
      monthlyPayments
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
