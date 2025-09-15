import { useQuery } from "@tanstack/react-query";
import { FaUserAlt, FaMoneyBillWave } from "react-icons/fa";
import { MdBook } from "react-icons/md";
import { LiaHotelSolid } from "react-icons/lia";
import {
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"];

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axios.get(`${window.location.origin}/api/stats/admin`);
      return res.data.stats;
    },
    enabled: !loading && user.role === "admin",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/forbidden");
    }
  }, [user, loading, router]);

  if (loading || isLoading) return <Loader />;

  // ---- Charts Data ----
  const monthlyBookingsData = stats.monthlyBookingsData || [];
  const monthlyPaymentsData = stats.monthlyPaymentsData || [];

  return (
    <div className="px-4">
      <div>
        <h2 className="text-center text-[#F7602C] font-bold text-3xl sm:text-4xl mb-8">
          Admin Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <div className="bg-pink-100 text-pink-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
            <FaUserAlt size={35} />
            <div>
              <p className="text-lg font-bold">{stats.totalUsers || 0}</p>
              <p className="text-sm font-medium">Total Users</p>
            </div>
          </div>

          <div className="bg-blue-100 text-blue-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
            <LiaHotelSolid size={35} />
            <div>
              <p className="text-lg font-bold">{stats.totalHotels || 0}</p>
              <p className="text-sm font-medium">Total Hotels</p>
            </div>
          </div>

          <div className="bg-green-100 text-green-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
            <FaMoneyBillWave size={35} />
            <div>
              <p className="text-lg font-bold">{stats.totalEarnings || 0}</p>
              <p className="text-sm font-medium">Total Earnings</p>
            </div>
          </div>

          <div className="bg-orange-100 text-orange-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
            <MdBook size={35} />
            <div>
              <p className="text-lg font-bold">{stats.totalBookings || 0}</p>
              <p className="text-sm font-medium">Total Bookings</p>
            </div>
          </div>
        </div>

        {/* Monthly Bookings */}
        <div className="bg-white shadow-xl mt-6 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Monthly Bookings Trend</h3>
          {monthlyBookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#36A2EB"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex justify-center items-center font-lg font-semibold h-[200px]">
              No bookings yet.
            </p>
          )}
        </div>

        {/* Payments */}
        <div className="bg-white shadow-xl mt-6 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Payments per Month</h3>
          {monthlyPaymentsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPaymentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="payments" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex justify-center items-center font-lg font-semibold h-[200px]">
              No payments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;