'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Footer = () => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <footer className="bg-gray-200 px-4 mt-10 border-t border-gray-200">
      <div className="max-w-[1500px] mx-auto py-10 grid md:grid-cols-3 gap-6">
        {/* Brand Section */}
        <div>
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.png"
              alt="Roomora Logo"
              height={120}
              width={200}
            />
          </Link>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Roomora makes hotel booking simple and hassle-free. Discover our
            top-rated hotels, explore detailed coverage, and book your stay with
            confidence. Your comfort, our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <nav>
            <ul className="flex flex-col items-start gap-4 p-3 font-semibold text-sm">
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
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-bold mb-3">Get In Touch</h3>
          <p className="text-sm mb-2">📍 Dhaka, Bangladesh</p>
          <p className="text-sm mb-2">📧 support@roomora.com</p>
          <p className="text-sm mb-2">📞 +880 1234 567 890</p>

          {/* Social Icons */}
          <div className="flex space-x-3 mt-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              className="p-2 bg-[#F7602C] text-white rounded-full hover:bg-[#F7602C]/80 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              className="p-2 bg-[#F7602C] text-white rounded-full hover:bg-[#F7602C]/80 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              className="p-2 bg-[#F7602C] text-white rounded-full hover:bg-[#F7602C]/80 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.github.com/SarfarazAkram17"
              target="_blank"
              className="p-2 bg-[#F7602C] text-white rounded-full hover:bg-[#F7602C]/80 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/sarfarazakram"
              target="_blank"
              className="p-2 bg-[#F7602C] text-white rounded-full hover:bg-[#F7602C]/80 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Roomora. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;