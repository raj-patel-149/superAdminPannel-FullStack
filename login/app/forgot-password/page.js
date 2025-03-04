"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Card,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/features/apiSlice";

export default function ForgotPasswordPage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(error.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-6 shadow-2xl bg-white rounded-xl">
        <Typography
          variant="h4"
          className="text-center font-bold text-gray-800"
        >
          Forgot Password
        </Typography>
        <Typography variant="body2" className="text-center text-gray-500 mt-10">
          Enter your email to receive a password reset link.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="bg-blue-600 hover:bg-blue-700"
          >
            {/* {isLoading ? "Sending..." : "Send Reset Link"} */} send
          </Button>

          {errorMessage && (
            <Typography color="error" className="text-center">
              {errorMessage}
            </Typography>
          )}
        </form>

        <div className="mt-4 text-center">
          <Button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </Button>
        </div>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Reset link sent successfully! Check your email.
        </Alert>
      </Snackbar>
    </div>
  );
}
