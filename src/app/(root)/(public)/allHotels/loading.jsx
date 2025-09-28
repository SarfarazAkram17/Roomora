import SkeletonHotelCard from "@/components/SkeletonHotelCard";

const Loading = () => {
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
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonHotelCard key={i} />
          ))}
        </div>
      </>
    </div>
  );
};

export default Loading;
