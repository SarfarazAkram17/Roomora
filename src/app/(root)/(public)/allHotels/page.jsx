import HotelCard from "@/components/HotelCard";
import PaginationClient from "@/components/PaginationClient";

// ✅ Server Component
export default async function HotelsPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  // Fetch hotels from API (server-side)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels?page=${page}&limit=${limit}`,
    { cache: "no-store" } // 👈 ensures SSR (fresh data each request)
  );
  const { hotels, total } = await res.json();

  return (
    <div className="px-4 my-6 max-w-[1500px] mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#F7602C] mb-3">
        All Hotels
      </h2>
      <p className="text-center text-sm text-gray-600 mb-10 max-w-3xl mx-auto">
        Discover a wide range of hotels tailored to your needs. Whether you’re
        planning a family vacation, a business trip, or a quick getaway, browse
        through our listings and book your perfect stay with ease. Enjoy a
        seamless booking experience and find the right room at the right
        price—all in one place.
      </p>

      {hotels.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No hotels available yet.
        </p>
      ) : (
        <>
          {/* Hotels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>

          {/* Pagination (client) */}
          <div className="flex justify-center mt-10">
            <PaginationClient current={page} total={total} pageSize={limit} />
          </div>
        </>
      )}
    </div>
  );
}
