"use client";
import Link from "next/link";
import Lottie from "lottie-react";
import errorLottie from "../../public/error.json";

const NotFound = () => {
  return (
    <div className="pb-8 flex flex-col items-center justify-center text-center bg-base-100 px-4">
      {/* 🔝 Lottie Animation */}
      <Lottie animationData={errorLottie} loop={true} className="w-[28%]" />

      {/* Subtitle */}
      <p className="mt-3 text-gray-600 text-lg max-w-md">
        The page you’re looking for doesn’t exist or has been moved. Let’s get
        you back on track.
      </p>

      {/* Actions */}
      <div className="mt-6">
        <Link
          href="/"
          className="bg-[#F7602C] border-2 border-[#F7602C] text-white/90 font-bold px-4 py-2 rounded-sm"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
