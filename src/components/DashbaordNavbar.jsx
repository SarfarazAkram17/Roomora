'use client'
import { useAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DashboardNavbar = () => {
  const { setIsOpen } = useAuth();

  return (
    <header className="lg:hidden max-lg:sticky top-0 backdrop-blur-2xl px-4 py-2 h-14 rounded-sm w-full shadow-md z-10">
      <section className="max-w-[1500px] w-full mx-auto flex justify-between items-center">
        {/* Mobile Hamburger */}
        <button
          className="lg:hidden hover:bg-gray-300 bg-gray-200 rounded-sm flex items-center py-2 px-3 mr-3"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <Link href="/" className="max-lg:flex-1">
          <Image src="/logo.png" alt="Roomora logo" height={65} width={150} />
        </Link>
      </section>
    </header>
  );
};

export default DashboardNavbar;