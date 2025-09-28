import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] 2xl:h-[50vh] 2xl:rounded-2xl max-w-[1500px] mx-auto flex items-center justify-center rounded-lg overflow-hidden text-white">
      <Image
        src="/banner.jpg"
        alt="Luxury hotel"
        fill
        priority
        className="object-fit brightness-75"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find Your Perfect Stay with <span className="text-[#F7602C]">Roomora</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover and book top-rated hotels across Bangladesh with ease and
          comfort.
        </p>
        <Link href="/allHotels">
          <Button variant="contained" size="lg" className="text-white">
            Book Hotels
          </Button>
        </Link>
      </div>
    </section>
  );
}