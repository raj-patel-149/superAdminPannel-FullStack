"use client";
import ManageAdmins from "@/app/Components/ManageAdmin";
import React from "react";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const superAdminId = searchParams.get("id");
  return <ManageAdmins superAdminId={superAdminId} />;
};

export default page;
