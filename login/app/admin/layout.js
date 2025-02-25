"use client";
import Sidebar from "../Components/Sidebar";
export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "auto" }}>
      <Sidebar role="admin" />
      <div style={{ flexGrow: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
