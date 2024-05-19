// components/FolderItem.js
import React, { useState } from "react";
import FileUpload from "./Upload";
import AddFolder from "./AddFolder";
import FolderList from "./FolderList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import DownloadIcon from "./Download";

const FolderItem = ({ folder, onUpload, level }) => {
  const [showContents, setShowContents] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleContents = () => {
    setShowContents(!showContents);
  };

  const handleDelete = async () => {
    try {
      const storage = getStorage();
      const folderRef = ref(storage, folder.path);

      // Delete all items within the folder first
      const listResponse = await listAll(folderRef);
      const deletePromises = listResponse.items.map((item) =>
        deleteObject(item)
      );

      await Promise.all(deletePromises);

      // Check if there are any subfolders and delete them as well
      for (const subfolderRef of listResponse.prefixes) {
        await deleteAllFilesInFolder(subfolderRef);
        await deleteObject(subfolderRef);
      }

      // Finally, delete the folder itself
      await deleteObject(folderRef);

      onUpload();
      setConfirmDelete(false);
      toast.success("Folder deleted successfully.");
    } catch (error) {
      console.error("Error deleting folder:", error);
      setConfirmDelete(false);
    }
  };

  const deleteAllFilesInFolder = async (folderRef) => {
    const listResponse = await listAll(folderRef);
    const deletePromises = listResponse.items.map((item) => deleteObject(item));

    await Promise.all(deletePromises);

    for (const subfolderRef of listResponse.prefixes) {
      await deleteAllFilesInFolder(subfolderRef);
      await deleteObject(subfolderRef);
    }
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
        <DownloadIcon entry={folder} />
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer ml-2 text-red-600"
          onClick={() => setConfirmDelete(true)}
        />
      </div>
      {showContents && (
        <FolderList currentPath={folder.path} level={level + 1} />
      )}

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this folder and all its contents?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FolderItem;
