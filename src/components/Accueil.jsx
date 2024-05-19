import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import NavLog from "./NavLog";
import FileUpload from "./FileComponents/Upload";
import AddFolder from "./FileComponents/AddFolder";
import FolderList from "./FileComponents/FolderList";

function Accueil() {
  const [userDetails, setUserDetails] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [loading, setLoading] = useState(true);

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

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  const handleRerender = () => {
    setRerender(!rerender);
  };

  const currentUser = auth.currentUser;

  if (loading) {
    return <div className="text-lg text-center text-white">Loading...</div>;
  }

  return (
    <>
      <NavLog />
      {currentUser && (
        <>
          <AddFolder Rerender={handleRerender} currentPath={currentUser.uid} />
          <FolderList currentPath={currentUser.uid} />
        </>
      )}
      <div className="max-w-md mx-auto mt-8 p-6 bg-transparent rounded-lg border-2 border-indigo-500">
        {userDetails ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Welcome{" "}
              {userDetails.firstName
                ? userDetails.firstName
                : userDetails.email}
            </h3>
            <div className="text-white">
              <p>Email: {userDetails.email}</p>
              <p>First Name: {userDetails.firstName}</p>
              <p>Last Name: {userDetails.lastName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-2 px-4 rounded hover:bg-indigo-500 hover:text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-lg text-center text-white">Loading...</p>
        )}
      </div>
    </>
  );
}

export default Accueil;
