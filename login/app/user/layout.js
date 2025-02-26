"use client";
import { useParams } from "next/navigation";
import Sidebar from "../Components/Sidebar";
import { PartyMode } from "@mui/icons-material";
export default function UserLayout({ children }) {
  const params = useParams();

  const id = params.userId;
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar role="user" id={id} />
      <div style={{ flexGrow: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
