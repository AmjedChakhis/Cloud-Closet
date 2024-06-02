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
    <div className="max-w-md mx-auto mt-4 p-4 bg-transparent rounded-lg border-2 border-indigo-500">
      {userDetails ? (
        <>
          <div className="flex items-center mb-2">
            {userDetails.profilePicture ? (
              <img
                src={userDetails.profilePicture}
                className="w-24 h-24 rounded-full mb-2"
              />
            ) : (
              <div className="w-15 h-15 rounded-full mb-2 flex items-center justify-center bg-indigo-500 text-white text-2xl">
                {userDetails.firstName.charAt(0)}
                {userDetails.lastName.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-white text-center">
                <p className="text-xl">Welcome,</p>
                <p className="text-2xl font-semibold">
                  {userDetails.firstName} {userDetails.lastName}
                </p>
              </div>
            </div>
          </div>
          <StorageBar userId={userId} shouldRerender={shouldRerender} />
          <button
            onClick={handleEditProfile}
            className="mt-2 w-full bg-transparent border-2 border-indigo-500 text-indigo-500 py-1 px-2 rounded hover:bg-indigo-500 hover:text-white"
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
