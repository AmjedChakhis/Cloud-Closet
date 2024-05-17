import React from "react";
import FileUpload from "./Upload";

const FolderItem = ({ folderName, userId }) => {
  return (
    <div>
      <h3>{folderName}</h3>
      <FileUpload userId={userId} folderName={folderName} />
    </div>
  );
};

export default FolderItem;
