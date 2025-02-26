"use client";
import { useLogoutMutation } from "@/features/apiSlice";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = ({ role, id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [logout] = useLogoutMutation();

  const menuItems =
    role === "admin"
      ? [
          { text: "Dashboard", path: `/admin/${id}/dashboard` },
          { text: "Manage Trainer", path: `/admin/${id}` },
        ]
      : role === "trainer"
      ? [
          { text: "Dashboard", path: `/trainer/${id}/dashboard` },
          { text: "Manage User", path: `/trainer/${id}` },
        ]
      : role === "superadmin"
      ? [
          { text: "Dashboard", path: "/super-admin/dashboard" },
          { text: "Manage Admins", path: "/super-admin/manageAdmin" },
        ]
      : [{ text: "Dashboard", path: "/user/dashboard" }];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Box sx={{ width: 240, p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">
          {role === "admin"
            ? "Admin Panel"
            : role === "trainer"
            ? "Trainer Panel"
            : role === "superadmin"
            ? "Super Admin Pannel"
            : "User Panel"}
        </Typography>
      </Box>
      <List>
        {menuItems.map(({ text, path }) => (
          <ListItem
            key={path}
            onClick={() => router.push(path)}
            selected={pathname === path}
            className="cursor-pointer hover:bg-slate-200"
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <ListItem className="cursor-pointer absolute bottom-0 hover:bg-red-700 mt-[400px] bg-red-400 ">
          <ListItemText primary={"logout"} onClick={handleLogout} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
