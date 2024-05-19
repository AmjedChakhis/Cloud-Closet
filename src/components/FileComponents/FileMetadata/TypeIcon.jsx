// components/Logo.jsx
import React from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileAlt,
} from "react-icons/fa";

const TypeIcon = ({ extension }) => {
  const getIcon = (extension) => {
    switch (extension) {
      case "pdf":
        return <FaFilePdf />;
      case "doc":
      case "docx":
        return <FaFileWord />;
      case "xls":
      case "xlsx":
        return <FaFileExcel />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FaFileImage />;
      case "mp3":
      case "wav":
        return <FaFileAudio />;
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo />;
      default:
        return <FaFileAlt />;
    }
  };

  return <span>{getIcon(extension)}</span>;
};

export default TypeIcon;
