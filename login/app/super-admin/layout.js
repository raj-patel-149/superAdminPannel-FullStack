"use client";
import Sidebar from "../Components/Sidebar";

export default function SuperAdminLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "auto" }}>
      <Sidebar role="superadmin" />
      <div style={{ flexGrow: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
