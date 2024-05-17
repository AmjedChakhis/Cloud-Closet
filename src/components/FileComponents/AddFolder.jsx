import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import { getStorage, ref, uploadString } from "firebase/storage";

const storage = getStorage();

const AddFolder = ({ Rerender, currentPath }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleCreateFolder = async () => {
    if (!name) {
      setMessage("Please enter a folder name.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage("No user is currently signed in.");
      return;
    }

    const folderRef = ref(
      storage,
      `${currentUser.uid}${currentPath}${name}/placeholder.txt`
    );

    try {
      await uploadString(folderRef, ""); // Upload an empty string as a placeholder file
      setMessage(`Folder "${name}" created successfully.`);
      Rerender();
      setName("");
      closeDialog();
    } catch (error) {
      console.error("Error creating folder:", error);
      setMessage(`Error creating folder: ${error.message}`);
    }
  };

  return (
    <>
      <Button onClick={openDialog} variant="outlined" size="small">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Add Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
        <p>{message}</p>
      </Dialog>
    </>
  );
};

export default AddFolder;
