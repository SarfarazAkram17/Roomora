"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Button, Chip, TextField } from "@mui/material";
import Select from "react-select";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// ---------------------- Pagination Actions ----------------------
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={(e) =>
          onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

// ---------------------- Booking Status Filter ----------------------
const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

// ---------------------- Main Component ----------------------
const UpcomingBookings = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "user")
        toast.info("You are not allowded for this page");
    }
  }, [user, loading, router]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "upcomingBookings",
      user,
      statusFilter.value,
      searchTerm,
      page,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `${window.location.origin}/api/upcomingBookings`,
        {
          params: {
            status: statusFilter.value,
            search: searchTerm,
            page: page + 1,
            limit: rowsPerPage,
          },
        }
      );
      return res.data;
    },
    enabled: !!user,
    keepPreviousData: true,
  });

  const bookings = data?.bookings || [];
  const total = data?.total || 0;

  useEffect(() => {
    refetch();
  }, [statusFilter, searchTerm, page, rowsPerPage]);

  const handlePay = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Payment?",
      text: "Are you sure you want to pay for this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.patch(
          `${window.location.origin}/api/myBookings/${id}`,
          {
            email: user.email,
            payment_status: "paid",
            status: "confirmed",
            paidAt: new Date().toISOString(),
          }
        );
        toast.success("Payment successful!");
        refetch();
      } catch (err) {
        if (err.status === 403) {
          router.push("/forbidden");
        }
        toast.error(
          err.response?.data?.message || err.message || "Payment failed"
        );
      }
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.patch(
          `${window.location.origin}/api/myBookings/${id}`,
          {
            email: user.email,
            payment_status: "cancelled",
            status: "cancelled",
            cancelledAt: new Date().toISOString(),
          }
        );
        toast.success("Booking cancelled!");
        refetch();
      } catch (err) {
        if (err.status === 403) {
          router.push("/forbidden");
        }
        toast.error(
          err.response?.data?.message || err.message || "Cancel failed"
        );
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#F7602C]">
        Upcoming Bookings
      </h2>

      {/* Search + Status Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <TextField
          label="Search by Hotel Name"
          variant="outlined"
          size="small"
          className="w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
        />

        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(selected) => {
            setStatusFilter(selected);
            setPage(0);
          }}
          className="w-full sm:w-1/2"
          styles={{
            control: (base) => ({ ...base, minHeight: 40, height: 40 }),
          }}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <p className="text-center mt-10 text-gray-600 text-lg font-medium">
          No bookings found.
        </p>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="bookings table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Hotel</TableCell>
                <TableCell>Rooms</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b, i) => (
                <TableRow key={b._id}>
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{b.hotelName}</TableCell>
                  <TableCell>{b.rooms}</TableCell>
                  <TableCell>
                    {new Date(b.checkIn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(b.checkOut).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{b.totalPrice} BDT</TableCell>
                  <TableCell>
                    {b.status === "pending" && (
                      <Chip label="Pending" color="primary" size="small" />
                    )}
                    {b.status === "confirmed" && (
                      <Chip label="Confirmed" color="secondary" size="small" />
                    )}
                    {b.status === "cancelled" && (
                      <Chip label="Cancelled" color="error" size="small" />
                    )}
                    {b.status === "completed" && (
                      <Chip label="Completed" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30]}
                  colSpan={7}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: false,
                  }}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default UpcomingBookings;