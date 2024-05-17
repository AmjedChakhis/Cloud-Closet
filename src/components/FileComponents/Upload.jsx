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
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { storage, auth } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FileUpload = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const currentUser = auth.currentUser;

  const handleUpload = () => {
    if (file) {
      const storageRef = ref(storage, `${currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress, pause, and resume states
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading file:", error.message);
          setMessage(`Error uploading file: ${error.message}`);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            setMessage("File uploaded successfully.");
          } catch (error) {
            console.error("Error getting download URL:", error.message);
            setMessage(`Error getting download URL: ${error.message}`);
          }
        }
      );
      // Close the dialog after upload
      closeDialog();
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
