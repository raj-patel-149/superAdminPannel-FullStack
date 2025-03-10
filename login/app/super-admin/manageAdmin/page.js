"use client";
import ManageAdmins from "@/app/Components/ManageAdmin";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ManageAdminPage() {
  const searchParams = useSearchParams();
  const superAdminId = searchParams.get("id");
  return <ManageAdmins superAdminId={superAdminId} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageAdminPage />
    </Suspense>
  );
}
