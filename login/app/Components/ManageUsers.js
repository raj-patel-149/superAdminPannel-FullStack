"use client";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  useAddUserMutation,
  useGetTrainerByIdQuery,
  useGetuserQuery,
} from "@/features/apiSlice";
import DisplayUsers from "./DisplayUsers";
import { useParams } from "next/navigation";

const ManageUsers = ({ role }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const params = useParams();

  const id = params?.trainerId;
  const { data: trainerData, isError } = useGetTrainerByIdQuery(id);

  const [addUser, isLoading] = useAddUserMutation();

  const { handleSubmit, control, reset } = useForm();

  const onSubmit = async (formData) => {
    try {
      await addUser({
        name: formData.username,
        email: formData.email,
        password: formData.password,
        parent_Id: id,
      }).unwrap();

      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage(
        error?.data?.message || error?.error || "Failed to add user."
      );
    }
  };

  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const title = trainerData?.admin?.name || "";

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          position: "relative",
          overflow: "auto",
        }}
      >
        <div className="flex">
          <Typography variant="h4">
            {" "}
            Users Under Trainer :{" "}
            <b className="text-green-900 hover:underline">
              {title.toUpperCase()}
            </b>
          </Typography>
        </div>

        <div className="flex justify-center items-center overflow-auto">
          <DisplayUsers trainerId={id} role={role} />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{
            position: "absolute",
            right: 16,
            top: 25,
            backgroundColor: "#535bad",
          }}
        >
          Add User
        </Button>

        {/* MUI Dialog for Adding User */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: "Username is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {"Add"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>

      {/* Snackbar for Success Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          User added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageUsers;
