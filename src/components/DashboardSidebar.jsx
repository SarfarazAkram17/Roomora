"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard,
  MdPerson,
  MdAddBox,
  MdBook,
  MdUpcoming,
  MdLogout,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";
import { LiaHotelSolid } from "react-icons/lia";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardSidebar() {
  const { loading, user, isOpen, setIsOpen, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // ✅ Close sidebar if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (loading) return null;

  const routes = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={20} /> },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <MdPerson size={23} />,
    },
    ...(user?.role === "admin"
      ? [
          {
            name: "Manage Users",
            path: "/dashboard/manageUsers",
            icon: <FaUsers size={23} />,
          },
          {
            name: "All Bookings",
            path: "/dashboard/allBookings",
            icon: <MdBook size={20} />,
          },
          {
            name: "Add Hotel",
            path: "/dashboard/addHotel",
            icon: <MdAddBox size={20} />,
          },
          {
            name: "Manage Hotels",
            path: "/dashboard/manageHotels",
            icon: <LiaHotelSolid size={20} />,
          },
        ]
      : []),
    ...(user?.role === "user"
      ? [
          {
            name: "My Bookings",
            path: "/dashboard/myBookings",
            icon: <MdBook size={20} />,
          },
          {
            name: "Upcoming Bookings",
            path: "/dashboard/upcomingBookings",
            icon: <MdUpcoming size={20} />,
          },
        ]
      : []),
  ];

  return (
    <section>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full w-60 bg-gray-100 shadow-md z-40
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex lg:flex-col
        `}
      >
        {/* Sidebar layout wrapper */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Roomora logo"
                height={75}
                width={180}
              />
            </Link>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
            {routes.map((route) => {
              const isActive = pathname === route.path;
              return (
                <Link
                  onClick={() => setIsOpen(false)}
                  key={route.name}
                  href={route.path}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors duration-200
                    ${
                      isActive
                        ? "bg-[#F7602C] text-white"
                        : "hover:bg-gray-500 hover:text-white/80"
                    }
                  `}
                >
                  {route.icon}
                  <span className="font-medium">{route.name}</span>
                </Link>
              );
            })}

            <div
              onClick={() => {
                logout();
                router.push("/login");
                queryClient.clear();
              }}
              className="px-4 py-2 rounded-md flex gap-2 mt-3 text-sm font-medium hover:bg-red-500 hover:text-white/85 items-center cursor-pointer"
            >
              <MdLogout size={20} /> Logout
            </div>
          </nav>

          {/* User info */}
          <div className="shrink-0 border-t-[1.5px] border-gray-300 bg-gray-100 py-2 px-4 flex gap-2 items-center">
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                <img
                  src={user?.photo}
                  alt={user?.name}
                  height={48}
                  width={48}
                  className="h-12 w-12 border-[#F7602C] border-[1.5px] object-cover rounded-full"
                />
                <div>
                  <p className="font-bold text-xs">{user?.name}</p>
                  <p className="text-xs capitalize">{user?.role}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}