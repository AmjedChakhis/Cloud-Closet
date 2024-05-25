import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import NavLog from "./NavLog";
import FileUpload from "./FileComponents/Upload";
import AddFolder from "./FileComponents/AddFolder";
import FolderList from "./FileComponents/FolderList";
import DragAndDrop from "./FileComponents/DragDrop";
import UserWelcome from "./FileComponents/UserWelcome";
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
      <div className="dashboard-grid">
        <div className="user-welcome">
          <UserWelcome
            userDetails={userDetails}
            userId={currentUser.uid}
            shouldRerender={handleRerender}
          />
        </div>
        {currentUser && (
          <>
            <div className="folder-actions">
              <AddFolder
                Rerender={handleRerender}
                currentPath={currentUser.uid}
              />
            </div>
            <div className="folder-list">
              <FolderList currentPath={currentUser.uid} />
            </div>
            <DragAndDrop
              folderPath={currentUser.uid}
              onUpload={handleRerender}
              closeDialog={() => {}}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Accueil;
