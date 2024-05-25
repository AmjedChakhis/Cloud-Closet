// components/FolderList.js
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import FolderItem from "./FolderItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import TypeIcon from "./FileMetadata/TypeIcon";
import FileSize from "./FileMetadata/FileSize";
import DownloadIcon from "./Download";
import GetPublicURL from "./FileMetadata/GetPublicUrl"; // Import the new component

const FolderList = ({ currentPath, level = 0 }) => {
  const auth = getAuth();
  const storage = getStorage();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

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

      const fileNames = await Promise.all(
        folderList.items.map(async (fileRef) => {
          const url = await getDownloadURL(fileRef);
          return {
            type: "file",
            name: fileRef.name,
            path: fileRef.fullPath,
            url: url,
          };
        })
      );

      const combinedEntries = [...folderNames, ...fileNames];

      setEntries(combinedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entry) => {
    try {
      const storage = getStorage();
      const entryRef = ref(storage, entry.path);

      await deleteObject(entryRef);
      fetchEntries();
      setConfirmDelete(null);
      toast.success(
        `${entry.type === "folder" ? "Folder" : "File"} deleted successfully.`
      );
    } catch (error) {
      console.error(`Error deleting ${entry.type}:`, error);
      toast.error(`Error deleting ${entry.type}.`);
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
          <li key={index} className={`ml-${level * 4} flex items-center`}>
            {entry.type === "folder" ? (
              <>
                <FolderItem
                  folder={entry}
                  onUpload={fetchEntries}
                  level={level}
                />
              </>
            ) : (
              <div className="flex items-center">
                <TypeIcon
                  extension={entry.name.split(".").pop().toLowerCase()}
                />
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600"
                >
                  {entry.name}
                </a>
                <FileSize filePath={entry.path} />
                <DownloadIcon entry={entry} />
                <GetPublicURL filePath={entry.path} />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer ml-2 text-red-600"
                  onClick={() => setConfirmDelete(entry)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {confirmDelete && (
        <Dialog open={true} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this {confirmDelete.type}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(confirmDelete)}
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default FolderList;
