"use client";
import { useParams } from "next/navigation";
import Sidebar from "../Components/Sidebar";

export default function SuperAdminLayout({ children }) {
  const params = useParams();
  const id = params.trainerId;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "auto" }}>
      <Sidebar role="trainer" id={id} />
      <div style={{ flexGrow: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
