"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 backdrop-blur-2xl p-4 h-20 w-full shadow-md z-50">
      <section className="max-w-[1500px] w-full mx-auto flex justify-between items-center">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden hover:bg-gray-300 bg-gray-200 rounded-sm flex items-center p-2 mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Logo */}
        <Link href="/" className="max-md:flex-1">
          <Image src="/logo.png" alt="Roomora logo" height={80} width={170} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block flex-1">
          <ul className="flex px-4 items-center justify-center gap-8 font-semibold text-sm xl:text-[1rem]">
            <li>
              <Link
                href="/"
                className={`${
                  isActive("/")
                    ? "text-[#F7602C] font-bold border-b-2 border-[#F7602C]"
                    : "hover:text-[#F7602C]"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`${
                  isActive("/about")
                    ? "text-[#F7602C] font-bold border-b-2 border-[#F7602C]"
                    : "hover:text-[#F7602C]"
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/allHotels"
                className={`${
                  isActive("/allHotels")
                    ? "text-[#F7602C] font-bold border-b-2 border-[#F7602C]"
                    : "hover:text-[#F7602C]"
                }`}
              >
                All Hotels
              </Link>
            </li>
            <li>
              <Link
                href="/coverage"
                className={`${
                  isActive("/coverage")
                    ? "text-[#F7602C] font-bold border-b-2 border-[#F7602C]"
                    : "hover:text-[#F7602C]"
                }`}
              >
                Coverage
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Image src={user.photo} height={48} width={48} alt={user.name} className="rounded-full h-12 w-12" />
              <button
                onClick={() => logout()}
                className="bg-red-400 cursor-pointer text-white/90 font-bold px-4 py-2 rounded-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-transparent border-2 border-[#F7602C] hover:bg-[#F7602C] text-[#F7602C] hover:text-white/90 font-bold px-4 py-2 rounded-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#F7602C] hidden md:flex border-2 border-[#F7602C] text-white/90 hover:text-[#F7602C] hover:bg-transparent font-bold px-4 py-2 rounded-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md w-44">
          <nav>
            <ul className="flex flex-col items-center gap-4 p-3 font-semibold text-sm">
              <li>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/allHotels" onClick={() => setIsOpen(false)}>
                  All Hotels
                </Link>
              </li>
              <li>
                <Link href="/coverage" onClick={() => setIsOpen(false)}>
                  Coverage
                </Link>
              </li>
            </ul>
          </nav>
          {!user && (
            <div className="flex flex-col items-center gap-2 pb-4">
              <Link
                href="/register"
                className="bg-[#F7602C] border-2 border-[#F7602C] text-white hover:text-[#F7602C] hover:bg-transparent font-bold px-4 py-2 rounded-sm"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
