"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TableSkeleton from "../Components/skeloton/TableSkeleton";
import HeaderSkeleton from "../Components/skeloton/HeaderSkeloton";

export default function AdminPage() {
  const router = useRouter();

  // Redirect to /admin/dashboard when visiting /admin
  useEffect(() => {
    router.push("/trainer/dashboard");
  }, []);

  return <HeaderSkeleton />; // Temporary loader
}
