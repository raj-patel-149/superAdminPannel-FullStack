"use client";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "../../features/apiSlice";
import { Button } from "@mui/material";

const HomePage = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="border-2 border-black p-10 bg-white rounded-3xl text-center">
        <h1 className="text-2xl font-[700]">Welcome to Home Page</h1>
        <p className="mt-2 text-xl font-mono">
          You have successfully logged in!
        </p>
        <div className="flex flex-col mt-4">
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            sx={{ marginTop: "18px" }}
          >
            home
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ marginTop: "22px", backgroundColor: "red" }}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
