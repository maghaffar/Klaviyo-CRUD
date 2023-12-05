import React from "react";
import ProfileModal from "../components/profileModal";
import Table from "../components/profileTable";
const ProfileMain = () => {
  return (
    <div>
      <div>
        <ProfileModal />
      </div>
      <div>
        <Table />
      </div>
    </div>
  );
};

export default ProfileMain;
