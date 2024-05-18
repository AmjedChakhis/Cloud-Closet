// components/FolderList.js

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getStorage, ref, listAll } from "firebase/storage";
import FolderItem from "./FolderItem";

const FolderList = ({ currentPath, level = 0 }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const path = currentPath || "/";
      const folderRef = ref(storage, `${path}`);
      const folderList = await listAll(folderRef);

      const folderNames = folderList.prefixes.map((folderRef) => ({
        type: "folder",
        name: folderRef.name.split("/").pop(),
        path: folderRef.fullPath,
      }));

      const fileNames = folderList.items.map((fileRef) => ({
        type: "file",
        name: fileRef.name,
        path: fileRef.fullPath,
      }));

      const combinedEntries = [...folderNames, ...fileNames];

      setEntries(combinedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [currentPath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {entries.map((entry, index) => (
          <li key={index} className={`ml-${level * 4}`}>
            {entry.type === "folder" ? (
              <FolderItem
                folder={entry}
                onUpload={fetchEntries}
                level={level}
              />
            ) : (
              <div className="flex items-center">📄 {entry.name}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderList;
