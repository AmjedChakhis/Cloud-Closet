// Accueil.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import NavLog from "../LandingPage/NavLog";
import FileUpload from "../FileComponents/FileActions/Upload";
import AddFolder from "../FileComponents/FileActions/AddFolder";
import FolderList from "../FileComponents/Folder&FileList/FolderList";
import Sidebar from "../FileComponents/SideBar/SideBar"; // Import the sidebar component
import "./Acceuil.css";

function Accueil() {
  const [userDetails, setUserDetails] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  const fetchUserData = async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("User is not logged in");
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleRerender = () => {
    setRerender(!rerender);
  };

  if (loading) {
    return <div className="text-lg text-center text-white">Loading...</div>;
  }

  return (
    <>
      <NavLog />
      <div className="ContainerAll">
        <div className="dashboard-grid">
          <div className="container1">
            <Sidebar
              userDetails={userDetails}
              userId={currentUser.uid}
              handleRerender={handleRerender}
            />
          </div>
          <div className="container2">
            {currentUser && (
              <>
                <div className="folder-actions">
                  <AddFolder
                    Rerender={handleRerender}
                    currentPath={currentUser.uid}
                  />
                  <FileUpload
                    folderPath={currentUser.uid}
                    onUpload={handleRerender}
                  />
                </div>
                <div className="folder-list">
                  <FolderList
                    currentPath={currentUser.uid}
                    Rerender={handleRerender}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Accueil;
