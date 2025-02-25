"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {
  const router = useRouter();

  // Redirect to /admin/dashboard when visiting /admin
  useEffect(() => {
    router.push("/user/dashboard");
  }, []);

  return <p>Loading...</p>; // Temporary loader
}
