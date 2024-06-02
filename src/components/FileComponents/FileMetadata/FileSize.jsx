// FileSize.jsx
import React, { useEffect, useState } from "react";
import { getStorage, ref, getMetadata } from "firebase/storage";

const FileSize = ({ filePath }) => {
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    const fetchFileSize = async () => {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, filePath);
        const metadata = await getMetadata(fileRef);
        setFileSize(metadata.size);
      } catch (error) {
        console.error("Error fetching file size:", error);
      }
    };

    fetchFileSize();
  }, [filePath]);

  const formatSize = (size) => {
    if (size === null) return "N/A";
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <span className="flex items-center text-xs text-gray-500">
      <span className="mr-1">📎</span>
      {formatSize(fileSize)}
    </span>
  );
};

export default FileSize;
