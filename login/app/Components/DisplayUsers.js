"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Switch,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TableSkeleton from "./skeloton/TableSkeleton";
import {
  useDeleteUserMutation,
  useGetuserQuery,
  useUpdateUserMutation,
} from "@/features/apiSlice";
import { useForm, Controller } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import { useParams, useRouter } from "next/navigation";

const DisplayUsers = ({ trainerId, role }) => {
  // State Hooks
  const [userStatus, setUserStatus] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();
  const params = useParams();
  const adminId = params.adminId;
  const handleAdminClick = (userId) => {
    if (role === "super") {
      router.push(`/super-admin/${adminId}/${trainerId}/${userId}`);
    } else if (role === "admin") {
      router.push(`/admin/${adminId}/${trainerId}/${userId}`);
    } else if (role === "trainer") {
      router.push(`/trainer/${trainerId}/${userId}`);
    }
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [statusFilter, setStatusFilter] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetuserQuery({
    status: statusFilter,
    page: paginationModel.page,
    limit: paginationModel.pageSize,
    search: debouncedSearch.length >= 2 ? debouncedSearch : "",
    trainerId: trainerId,
  });
  const users = data?.users || [];
  const totalUsers = data?.pagination?.totalUsers || 0;
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Mutations
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Form Management
  const { handleSubmit, control, reset, setValue, watch } = useForm();

  // Watch status once at the top level
  const statusValue = watch("status");

  // Update userStatus when users change
  useEffect(() => {
    if (users && users.length > 0) {
      const statusMap = users.reduce(
        (acc, user) => ({ ...acc, [user._id]: user.status === "active" }),
        {}
      );
      setUserStatus(statusMap);
    }
  }, [users]);

  // Toggle Status
  const handleStatusToggle = (userId) => {
    setUserStatus((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Open Delete Confirmation Dialog
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  // Delete User
  const handleDelete = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId).unwrap();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setOpenDialog(false);
  };

  // Open Edit Dialog & Populate Fields
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", user.password);
    setValue("status", user.status === "active");
    setOpenEditDialog(true);
  };

  // Update User Submission
  const handleEditSubmit = async (data) => {
    try {
      await updateUser({
        id: selectedUser._id,
        name: data.name,
        email: data.email,
        password: data.password,
        status: data.status ? "active" : "inactive",
      }).unwrap();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle Loading State
  if (!users) return <TableSkeleton rows={5} />;

  // DataGrid Columns
  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "password",
      headerName: "Password",
      width: 140,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     const userId = params.row._id;
    //     return (
    //       <div className="flex justify-start items-center">
    //         <Switch
    //           disabled
    //           checked={userStatus[userId] || false}
    //           onChange={() => handleStatusToggle(userId)}
    //           color="success"
    //         />
    //         {userStatus[userId] ? "Active🟢" : "Inactive 🔴"}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "signup",
      headerName: "Signup Method",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "user_status",
      headerName: "User Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center mt-4">
            <Typography
              sx={{
                color:
                  params.value === "Email sent"
                    ? "orange"
                    : params.value === "Email accepted"
                    ? "blue"
                    : params.value === "Password not set"
                    ? "red"
                    : "green",
                fontSize: "14px",
              }}
            >
              {params.value}
            </Typography>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ marginRight: "10px", backgroundColor: "#4385ab" }}
            onClick={() => handleOpenEditDialog(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleOpenDialog(params.row._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // DataGrid Rows
  const rows = Array.isArray(users)
    ? users.map((user, index) => ({
        id: index + 1,
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        signup: user.signup || "User",
        // status: user.status || "inactive",
        user_status: user.user_Status || "Email sent",
      }))
    : [];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1300,
          height: "100%",
          mx: "auto",
          marginTop: 2,
        }}
      >
        <div className="flex justify-evenly items-center">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft: "30px",
            }}
          >
            <FormControl sx={{ width: 150, height: 50 }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={statusFilter}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="active">active</MenuItem>
                <MenuItem value="inactive">inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div className="flex justify-center items-center relative">
            <TextField
              id="outlined-basic"
              label="Search here...."
              variant="outlined"
              sx={{ width: "300px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute right-0 mr-4" />
          </div>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center mt-[30px]">
            <Typography
              sx={{
                fontSize: "25px",
                fontWeight: "700",
                wordSpacing: "5px",
                color: "#e6746a",
              }}
              className="tracking-[20px]"
            >
              No users found.
            </Typography>
          </div>
        ) : (
          <Paper
            sx={{
              height: 400,
              width: "100%",
              overflow: "hidden",
              marginTop: "20px",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              rowCount={totalUsers}
              paginationMode="server"
              paginationModel={paginationModel}
              onRowDoubleClick={(params) => handleAdminClick(params.row._id)}
              onPaginationModelChange={(newModel) =>
                setPaginationModel(newModel)
              }
              loading={isLoading}
              autoPageSize={false}
              sx={{
                "& .MuiDataGrid-virtualScroller": {
                  overflow: "auto",
                  maxHeight: 400,
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
                "& .MuiDataGrid-footerContainer": {
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                },
              }}
            />
          </Paper>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "OK"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="text"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label={statusValue ? "Active 🟢" : "Inactive 🔴"}
                  />
                )}
              />
              <DialogActions>
                <Button
                  onClick={() => setOpenEditDialog(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default DisplayUsers;
