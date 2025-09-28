const SkeletonHotelCard = () => {
  return (
    <div className="border h-full rounded-xl overflow-hidden shadow animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-52 sm:h-60 bg-gray-300" />

      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-2/3 bg-gray-300 rounded" />

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-300 rounded" />
          <div className="h-3 w-5/6 bg-gray-300 rounded" />
          <div className="h-3 w-4/6 bg-gray-300 rounded" />
        </div>

        {/* Price */}
        <div className="h-4 w-1/3 bg-gray-300 rounded" />

        {/* Button */}
        <div className="mt-4">
          <div className="h-8 w-24 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonHotelCard;