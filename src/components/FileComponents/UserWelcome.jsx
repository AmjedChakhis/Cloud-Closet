// UserWelcome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import StorageBar from "./StorageBar";

const UserWelcome = ({ userDetails, userId, shouldRerender }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-transparent rounded-lg border-2 border-indigo-500">
      {userDetails ? (
        <>
          <div className="flex items-center mb-4">
            <img
              src={userDetails.profilePicture || "default-profile-picture-url"}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <div className="text-white text-center">
                <p className="text-2xl">Welcome,</p>
                <p className="text-3xl font-semibold">
                  {userDetails.firstName} {userDetails.lastName}
                </p>
              </div>
            </div>
          </div>
          <StorageBar userId={userId} shouldRerender={shouldRerender} />
          <button
            onClick={handleEditProfile}
            className="mt-4 w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-2 px-4 rounded hover:bg-indigo-500 hover:text-white"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <p className="text-lg text-center text-white">Loading...</p>
      )}
    </div>
  );
};

export default UserWelcome;
