import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ProgressBar } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DragDrop.css"; // Import the CSS file

const DragAndDrop = ({ folderPath, onUpload }) => {
  const storage = getStorage();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    handleUpload(uploadedFile);
  };

  const handleUpload = (file) => {
    if (file) {
      const storageRef = ref(storage, `${folderPath}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error.message);
          setMessage(`Error uploading file: ${error.message}`);
          toast.error(`Error uploading file: ${error.message}`);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            setMessage("File uploaded successfully.");
            toast.success("File uploaded successfully.");
            setUploadProgress(0);
            onUpload();
          } catch (error) {
            console.error("Error getting download URL:", error.message);
            setMessage(`Error getting download URL: ${error.message}`);
            toast.error(`Error getting download URL: ${error.message}`);
          }
        }
      );
    } else {
      setMessage("Please select a file.");
      toast.warn("Please select a file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone-content">
        <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" color="#007BFF" />
        <p>Drag & drop files here, or click to select files</p>
        {uploadProgress > 0 && (
          <ProgressBar
            animated
            now={uploadProgress}
            label={`${Math.round(uploadProgress)}%`}
          />
        )}
        {message && <p style={{ color: "#00aeff" }}>{message}</p>}
      </div>
    </div>
  );
};

export default DragAndDrop;
