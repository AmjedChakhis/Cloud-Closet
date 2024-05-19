// components/DownloadIcon.jsx
import React from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const DownloadIcon = ({ entry }) => {
  const storage = getStorage();

  const handleDownload = async () => {
    try {
      if (entry.type === "file") {
        const fileRef = ref(storage, entry.path);
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const blob = await response.blob();
        saveAs(blob, entry.name);
      } else if (entry.type === "folder") {
        const folderRef = ref(storage, entry.path);
        const folderItems = await listAll(folderRef);
        const zip = new JSZip();

        await Promise.all(
          folderItems.items.map(async (itemRef) => {
            const fileUrl = await getDownloadURL(itemRef);
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const fileName = itemRef.fullPath.replace(`${entry.path}/`, "");
            zip.file(fileName, blob);
          })
        );

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${entry.name}.zip`);
      }
    } catch (error) {
      console.error("Error downloading file/folder:", error);
    }
  };

  return (
    <FontAwesomeIcon
      icon={faDownload}
      className="cursor-pointer ml-2 text-blue-600"
      onClick={handleDownload}
    />
  );
};

export default DownloadIcon;
