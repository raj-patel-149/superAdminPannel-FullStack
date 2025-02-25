"use client";
import { useForm } from "react-hook-form";
import { useSignupMutation } from "../../features/apiSlice";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await signup(data).unwrap();
      if (res.success) {
        router.push("/login"); // Redirect to login page after successful signup
      }
    } catch (err) {
      setErrorMessage(err.data?.message || "Signup failed");
    }
  };

  const handlelogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="border-2 border-black p-8 rounded-lg shadow-lg bg-white w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            placeholder="Enter Username"
            variant="outlined"
            {...register("name", { required: "Username is required" })}
            className="w-full mb-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <TextField
            label="Email"
            placeholder="Enter email"
            variant="outlined"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full mb-2"
            sx={{ marginTop: "10px" }}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <TextField
            label="Password"
            placeholder="Enter password"
            variant="outlined"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full mb-4"
            sx={{ marginTop: "10px" }}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            className="w-full"
            sx={{ marginTop: "10px" }}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </Button>
          <Button
            variant="contained"
            disabled={isLoading}
            className="w-full"
            sx={{ marginTop: "10px", backgroundColor: "green" }}
            onClick={handlelogin}
          >
            Have an account!! LogIn
          </Button>
        </form>
        {errorMessage && (
          <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
