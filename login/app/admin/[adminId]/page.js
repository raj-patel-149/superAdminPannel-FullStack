import ManageTrainer from "@/app/Components/Admin/ManageTrainer";
import DisplayAdmin from "@/app/Components/DisplayAdmin";
import ManageAdmins from "@/app/Components/ManageAdmin";
import React from "react";

const page = () => {
  return (
    <div>
      <ManageTrainer role="admin" />
    </div>
  );
};

export default page;
