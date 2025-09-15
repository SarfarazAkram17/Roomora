import { useQuery } from "@tanstack/react-query";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { MdBook } from "react-icons/md";
import { TbCalendarCancel } from "react-icons/tb";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const res = await axios.get(
        `${window.location.origin}/api/stats/user?email=${user.email}`
      );
      return res.data.stats;
    },
    enabled: !loading && user.role === "user",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "user")
        toast.error("You are admin you don't see users stats");
    }
  }, [user, loading, router]);

  const {
    totalBookings,
    totalSpent,
    upcomingBookings,
    cancelledBookings,
    monthlyBookings = [],
    monthlyPayments = [],
  } = stats;

  if (loading || isLoading) return <Loader />;

  return (
    <div className="px-4 space-y-8">
      <h2 className="text-center text-[#F7602C] font-bold text-3xl sm:text-4xl mb-8">
        Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <div className="bg-pink-100 text-pink-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
          <MdBook size={35} />
          <div>
            <p className="text-lg font-bold">{totalBookings || 0}</p>
            <p className="text-sm font-medium">Total Bookings</p>
          </div>
        </div>

        <div className="bg-green-100 text-green-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
          <FaMoneyBillWave size={35} />
          <div>
            <p className="text-lg font-bold">৳ {totalSpent || 0}</p>
            <p className="text-sm font-medium">Total Spent</p>
          </div>
        </div>

        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
          <FaArrowsRotate size={35} />
          <div>
            <p className="text-lg font-bold">{upcomingBookings || 0}</p>
            <p className="text-sm font-medium">Upcoming Bookings</p>
          </div>
        </div>

        <div className="bg-orange-100 text-orange-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
          <TbCalendarCancel size={35} />
          <div>
            <p className="text-lg font-bold">{cancelledBookings || 0}</p>
            <p className="text-sm font-medium">Cancelled Bookings</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl shadow-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
        {monthlyBookings.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex justify-center items-center font-lg font-semibold h-[200px]">
            No bookings yet.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Monthly Payments</h3>
        {monthlyPayments.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="payments"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex justify-center items-center font-lg font-semibold h-[200px]">
            No payments yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;