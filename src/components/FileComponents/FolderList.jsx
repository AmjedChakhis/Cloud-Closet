import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getStorage, ref, listAll } from "firebase/storage";

const FolderList = ({ currentPath }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        const path = currentPath || "/";
        const folderRef = ref(storage, `${user.uid}${path}`);
        const folderList = await listAll(folderRef);

        // Extract folder names from the list
        const folderNames = folderList.prefixes.map((folderRef) => ({
          name: folderRef.name.split("/").pop(),
          path: folderRef.fullPath,
        }));

        setFolders(folderNames);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false); // Set loading state to false once fetching is done
      }
    };

    fetchFolders();
  }, [currentPath]);

  if (loading) {
    return <div>Loading...</div>; // Render loading state while fetching data
  }

  return (
    <div>
      <h2>Folders:</h2>
      <ul>
        {folders.map((folder, index) => (
          <li key={index}>{folder.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FolderList;
