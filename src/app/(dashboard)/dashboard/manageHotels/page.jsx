"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Swal from "sweetalert2";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { Pagination } from "antd";
import { FaEye } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

const ManageHotels = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/forbidden");
    }
  }, [user, loading, router]);

  // Fetch hotels
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["hotels", page],
    queryFn: async () => {
      const res = await axios.get(`${window.location.origin}/api/hotels`, {
        params: { page, limit: 12 },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const hotels = data?.hotels || [];
  const total = data?.total || 0;

  // Delete hotel
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This hotel will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `${window.location.origin}/api/hotels/${id}`
          );
          if (res.data.deletedCount) {
            toast.success("The hotel has been deleted successfully");
            refetch();
          }
        } catch (error) {
          if (error.status === 403) {
            router.push("/forbidden");
          }
          toast.error(
            error.message ||
              error.response?.data?.message ||
              "Failed to delete hotel"
          );
        }
      }
    });
  };

  if (loading || isLoading) return <Loader />;

  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#F7602C] mb-10">
        Manage Hotels
      </h2>

      {hotels.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No hotels available yet.
        </p>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="border h-full rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500"
              >
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-52 sm:h-60 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-[#F7602C]">
                    {hotel.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    <strong>Added On:</strong>{" "}
                    {new Date(hotel.addedAt).toLocaleString("en-BD")}
                  </p>

                  <p className="text-sm text-gray-600">{hotel.description}</p>

                  <p className="text-sm">
                    <strong>Price per night:</strong> ৳{hotel.pricePerNight}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Link href={`/hotels/${hotel._id}`}>
                        <Button
                          variant="contained"
                          sx={{ fontSize: "10px" }}
                          size="small"
                          className="text-white"
                        >
                          <FaEye size={15} className="mr-1" /> Details
                        </Button>
                      </Link>
                      <Link href={`/dashboard/editHotel/${hotel._id}`}>
                        <Button
                          variant="contained"
                          sx={{ fontSize: "10px" }}
                          size="small"
                          className="text-white"
                          color="secondary"
                        >
                          <FiEdit3 size={15} className="mr-1" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(hotel._id)}
                        sx={{ fontSize: "10px" }}
                        size="small"
                        color="error"
                        className="text-white"
                      >
                        <FiTrash2 size={15} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <Pagination
              current={page}
              align="center"
              total={total}
              pageSize={12}
              showSizeChanger={false}
              onChange={(newPage) => {
                setPage(newPage);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageHotels;