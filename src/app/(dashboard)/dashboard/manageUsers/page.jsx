"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Image from "next/image";

// ✅ MUI imports
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
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// ---------------------- Custom Pagination Actions ----------------------
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

// ---------------------- Filters ----------------------
const searchOptions = [
  { value: "name", label: "Search by Name" },
  { value: "email", label: "Search by Email" },
];

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

// ---------------------- Main Component ----------------------
const ManageUsers = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [searchType, setSearchType] = useState(searchOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleOptions[0]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "users",
      user,
      searchType.value,
      searchTerm,
      roleFilter.value,
      page,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axios.get(`${window.location.origin}/api/users`, {
        params: {
          email: user?.email,
          page: page + 1,
          limit: rowsPerPage,
          searchType: searchType.value,
          search: searchTerm,
          role: roleFilter.value,
        },
      });
      return res.data;
    },
    enabled: !!user,
    keepPreviousData: true,
  });

  const users = data?.users || [];
  const total = data?.total || 0;

  // Refetch on filter/page changes
  useEffect(() => {
    refetch();
  }, [searchTerm, searchType, roleFilter, page, rowsPerPage]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/forbidden");
    }
  }, [user, loading, router]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${window.location.origin}/api/users/${id}`
        );
        toast.success("User deleted");
        refetch();
      } catch (err) {
        if (err.status === 403) {
          router.push("/forbidden");
        }
        toast.error(
          err.response?.data?.message || err.message || "Delete failed"
        );
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#F7602C]">
        Manage Users
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <Select
          options={searchOptions}
          value={searchType}
          onChange={(selected) => {
            setSearchType(selected);
            setPage(0);
          }}
          className="w-full md:w-1/3"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 40,
              height: 40,
            }),
          }}
        />

        <TextField
          label={`Search by ${searchType.value}`}
          variant="outlined"
          size="small"
          sx={{ height: 40 }}
          className="w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
        />

        <Select
          options={roleOptions}
          value={roleFilter}
          onChange={(selected) => {
            setRoleFilter(selected);
            setPage(0);
          }}
          className="w-full md:w-1/3"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 40,
              height: 40,
            }),
          }}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <Loader></Loader>
      ) : users.length === 0 ? (
        <p className="text-center mt-10 text-gray-600 text-lg font-medium">
          No users found.
        </p>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="users table" size="small">
            {/* ✅ Header row */}
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 0.5 }}>#</TableCell>
                <TableCell sx={{ py: 0.5 }}>Photo</TableCell>
                <TableCell sx={{ py: 0.5 }}>Name</TableCell>
                <TableCell sx={{ py: 0.5 }}>Email</TableCell>
                <TableCell sx={{ py: 0.5 }}>Role</TableCell>
                <TableCell sx={{ py: 0.5 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u, i) => (
                <TableRow key={u._id}>
                  <TableCell sx={{ py: 0.5 }}>
                    {page * rowsPerPage + i + 1}
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Image
                      className="h-11 w-11 rounded-full object-cover"
                      src={u.photo}
                      height={44}
                      width={44}
                      alt={u.name}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>{u.name}</TableCell>
                  <TableCell sx={{ py: 0.5 }}>{u.email}</TableCell>
                  <TableCell sx={{ py: 0.5 }} className="capitalize">
                    {u.role}
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Button
                      onClick={() => handleDelete(u._id)}
                      variant="contained"
                      sx={{ fontSize: "12px", padding: "6px" }}
                      size="small"
                      className="text-white"
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30]}
                  colSpan={6}
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

export default ManageUsers;