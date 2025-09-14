import Link from "next/link";
import { MdBlock } from "react-icons/md";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-base-100 px-4">
      {/* 🚫 Icon */}
      <div className="bg-[#F7602C]/10 p-6 rounded-full">
        <MdBlock className="text-[#F7602C]" size={85} />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#F7602C] mt-6">
        403 – Forbidden
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-gray-600 text-lg max-w-md">
        Sorry, you don’t have permission to access this page.
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

export default Forbidden;