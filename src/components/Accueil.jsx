import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import NavLog from "./NavLog";
function Accueil() {
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
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
  return (
    <>
      <NavLog />
      <div className="max-w-md mx-auto mt-8 p-6 bg-transparent rounded-lg border-2 border-indigo-500">
        {userDetails ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Welcome{" "}
              {userDetails.firstName
                ? userDetails.firstName
                : userDetails.email}{" "}
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
