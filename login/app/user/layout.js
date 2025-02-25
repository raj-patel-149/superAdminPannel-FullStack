"use client";
import Sidebar from "../Components/Sidebar";
export default function UserLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar role="user" />
      <div style={{ flexGrow: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
