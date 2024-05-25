// components/GetPublicURL.js
import React from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const GetPublicURL = ({ filePath }) => {
  const handleGetURL = async () => {
    const storage = getStorage();
    const fileRef = ref(storage, filePath);

    try {
      const url = await getDownloadURL(fileRef);
      navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!", {
        position: "top-center",
      });
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error getting public URL:", error);
      toast.error("Error getting public URL.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <FontAwesomeIcon
      icon={faLink}
      className="cursor-pointer ml-2 text-blue-600"
      onClick={handleGetURL}
    />
  );
};

export default GetPublicURL;
