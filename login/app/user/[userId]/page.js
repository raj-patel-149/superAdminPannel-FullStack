"use client";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/features/apiSlice";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ProfilePage = () => {
  const params = useParams();
  const userId = params.userId;

  // Fetch user data
  const { data: userData, isError, isLoading } = useGetUserByIdQuery(userId);

  // Update user mutation
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Store user data
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    }
  }, [userData]);

  // MUI Dialog State
  const [open, setOpen] = useState(false);

  // React Hook Form
  const { register, handleSubmit, setValue } = useForm();

  // Open Dialog & Set Form Data
  const handleEditClick = () => {
    setValue("name", user?.name);
    setValue("email", user?.email);
    setValue("password", user?.password);
    setOpen(true);
  };

  // Handle Form Submission (Update User)
  const onSubmit = async (formData) => {
    try {
      const updatedData = { id: userId, ...formData };
      const response = await updateUser(updatedData);
      if (response.data?.success) {
        setUser(response.data.user); // Update UI optimistically
        setOpen(false); // Close dialog
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (isLoading)
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">Error loading user data.</div>
    );

  return (
    <div className="flex justify-center items-center h-full bg-gray-200">
      <Card
        sx={{
          minWidth: 400,
          maxWidth: 500,
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          bgcolor: "white",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            <AccountCircleIcon /> {user?.name.toUpperCase()}'s Profile
          </Typography>
          <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Role:</strong> {user?.role}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Status:</strong>{" "}
              {user?.status ? "Active🟢" : "Inactive 🔴"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Parent ID:</strong> {user?.parent_Id}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "10px" }}
              className="border-2 p-3 rounded-2xl mt-3 bg-gray-700 text-white font-[300]"
            >
              <strong>Password:</strong> {user?.password}
            </Typography>
          </Box>
        </CardContent>

        {/* Edit Button */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>
        </Box>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name")}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email")}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
