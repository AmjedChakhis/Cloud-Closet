import React, { useEffect, useState } from "react";
import { auth, db, storage } from "./firebase"; // Assuming you have Firebase Storage initialized in firebase.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import NavLog from "./NavLog";
import { Upload } from "react-feather";

function EditProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          }
        } else {
          console.log("User is not logged in");
        }
      });
    };

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

  async function handleUpdateName() {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "Users", user.uid), {
          firstName: newFirstName,
          lastName: newLastName,
        });
        setUserDetails({
          ...userDetails,
          firstName: newFirstName,
          lastName: newLastName,
        });
        toast.success("Name updated successfully!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating name:", error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  }

  async function handleUploadProfilePicture() {
    try {
      const user = auth.currentUser;
      if (user && profileImage) {
        const storageRef = ref(
          storage,
          `profilePictures/${user.uid}/${profileImage.name}`
        );
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, profileImage);
        // Get download URL for the uploaded image
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Update user profile with the image URL
        await updateDoc(doc(db, "Users", user.uid), {
          profilePicture: imageUrl,
        });

        // Update userDetails state to reflect the changes
        setUserDetails({ ...userDetails, profilePicture: imageUrl });

        toast.success("Profile picture uploaded successfully!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto p-6 bg-transparent rounded-lg border-2 border-indigo-500">
        <NavLog />
        {userDetails ? (
          <>
            <div className="flex flex-col items-center mb-4">
              <img
                src={
                  userDetails.profilePicture || "default-profile-picture-url"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="mb-2 opacity-0 absolute w-0 h-0 overflow-hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-2 px-4 rounded hover:bg-indigo-500 hover:text-white mb-2 flex items-center justify-center"
              >
                <Upload className="mr-2" />
                Choose File
              </label>
              <button
                onClick={handleUploadProfilePicture}
                className="w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-2 px-4 rounded hover:bg-indigo-500 hover:text-white mb-2"
              >
                Upload Profile Picture
              </button>
              <h3 className="text-xl font-semibold mt-2 text-white">
                Welcome{" "}
                {userDetails.firstName
                  ? userDetails.firstName
                  : userDetails.email}{" "}
              </h3>
              <div className="text-white mt-2">
                <p>Email: {userDetails.email}</p>
                <p>First Name: {userDetails.firstName}</p>
                <p>Last Name: {userDetails.lastName}</p>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="New First Name"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="w-full py-2 px-3 mb-2 border-2 rounded placeholder-gray-500 focus:outline-none focus:ring focus:border-indigo-500 text-black"
                />
                <input
                  type="text"
                  placeholder="New Last Name"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className="w-full py-2 px-3 mb-2 border-2 rounded placeholder-gray-500 focus:outline-none focus:ring focus:border-indigo-500 text-black"
                />
                <button
                  onClick={handleUpdateName}
                  className="w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-2 px-4 rounded hover:bg-indigo-500 hover:text-white"
                >
                  Update Name
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-2 px-4 rounded hover:bg-indigo-500 hover:text-white"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg text-center text-white">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
