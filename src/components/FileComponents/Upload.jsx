// components/FileUpload.js

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../firebase";

const FileUpload = ({ folderPath, onUpload }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleUpload = () => {
    if (file) {
      const storageRef = ref(storage, `${folderPath}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error.message);
          setMessage(`Error uploading file: ${error.message}`);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            setMessage("File uploaded successfully.");
            onUpload();
            closeDialog();
          } catch (error) {
            console.error("Error getting download URL:", error.message);
            setMessage(`Error getting download URL: ${error.message}`);
          }
        }
      );
    } else {
      setMessage("Please select a file.");
    }
  };

  return (
    <>
      <Button onClick={openDialog} variant="outlined" size="small">
        <FontAwesomeIcon icon={faFileUpload} />
      </Button>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpload} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
        <p>{message}</p>
      </Dialog>
    </>
  );
};

export default FileUpload;
