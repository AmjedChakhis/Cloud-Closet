// Sidebar.js
import React from "react";
import DragAndDrop from "../FileActions/DragDrop";
import UserWelcome from "./UserWelcome";
import "./SiderBar.css";

const Sidebar = ({ userDetails, userId, handleRerender }) => {
  return (
    <div className="sidebar">
      <div className="user-welcome">
        <UserWelcome
          userDetails={userDetails}
          userId={userId}
          shouldRerender={handleRerender}
        />
      </div>
      <div className="drag-drop">
        <DragAndDrop folderPath={userId} onUpload={handleRerender} />
      </div>
    </div>
  );
};

export default Sidebar;
