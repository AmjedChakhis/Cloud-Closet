// components/FolderItem.js

import React, { useState } from "react";
import FileUpload from "./Upload";
import AddFolder from "./AddFolder";
import FolderList from "./FolderList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const FolderItem = ({ folder, onUpload, level }) => {
  const [showContents, setShowContents] = useState(false);

  const toggleContents = () => {
    setShowContents(!showContents);
  };

  return (
    <div className={`ml-${level * 4}`}>
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={showContents ? faChevronDown : faChevronRight}
          onClick={toggleContents}
          className="cursor-pointer mr-2"
        />
        📁 {folder.name}
        <FileUpload folderPath={folder.path} onUpload={onUpload} />
        <AddFolder Rerender={onUpload} currentPath={folder.path} />
      </div>
      {showContents && (
        <FolderList currentPath={folder.path} level={level + 1} />
      )}
    </div>
  );
};

export default FolderItem;
