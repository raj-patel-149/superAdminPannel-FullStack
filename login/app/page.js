"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <center className="border-2 border-black w-fit p-10 bg-white">
        <h2 className="font-[900] text-3xl">Welcome to Landing Page...</h2>
        <div className="mt-4 space-x-4">
          {!isAuthenticated && (
            <Button variant="contained" onClick={() => router.push("/signUp")}>
              Signup
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => router.push(isAuthenticated ? "/home" : "/login")}
          >
            {isAuthenticated ? "Go to Home" : "Go to Login"}
          </Button>
        </div>
      </center>
    </div>
  );
};

export default LandingPage;
