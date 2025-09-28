import HotelDetailsClient from "../HotelDetailsClient";

export default async function HotelDetailsPage({ params, searchParams }) {
  const { id } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels/${id}`,
    { cache: "no-store" }
  );
  const { hotel } = await res.json();

  if (!hotel) return <p className="text-center mt-10">Hotel not found.</p>;

  return <HotelDetailsClient hotel={hotel} />;
}