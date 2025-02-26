"use client";
import { useState } from "react";
import { useLoginMutation } from "../../features/apiSlice";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Snackbar, Alert } from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await login({ email: username, password }).unwrap();

      if (res.success) {
        // Check the user's role and redirect accordingly
        if (res.role === "superadmin") {
          setSnackbarOpen(true);
          setTimeout(() => {
            router.push(`/super-admin`);
          }, 700);
        } else if (res.role === "admin") {
          setSnackbarOpen(true);
          setTimeout(() => {
            router.push(`/admin/${res.id}`);
          }, 700);
        } else if (res.role === "trainer") {
          setSnackbarOpen(true);
          setTimeout(() => {
            router.push(`/trainer/${res.id}`);
          }, 700);
        } else {
          setSnackbarOpen(true);
          setTimeout(() => {
            router.push(`/user/${res.id}`);
          }, 700); // Redirect to the user home page
        }
      }
    } catch (err) {
      setError(err.data?.message || "Something went wrong.");
    }
  };

  const handleSignUp = () => {
    router.push("/signUp");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="border-2 border-black p-8 rounded-lg shadow-lg bg-white w-80 relative">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

          <TextField
            label="Email"
            placeholder="Enter Email"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-2"
          />
          <TextField
            label="Password"
            placeholder="Enter Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginTop: "10px" }}
            className="w-full mb-4 mt-3"
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            sx={{ marginTop: "10px" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Button
            variant="contained"
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full"
            sx={{ marginTop: "10px", backgroundColor: "green" }}
          >
            Not have an account? Register
          </Button>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          className="text-[20px]"
        >
          Successfully logged in!
        </Alert>
      </Snackbar>
    </>
  );
}
