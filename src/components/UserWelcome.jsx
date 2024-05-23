// UserWelcome.js
import React from "react";

const UserWelcome = ({ userDetails, handleLogout }) => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-transparent rounded-lg border-2 border-indigo-500">
      {userDetails ? (
        <>
          <h3 className="text-xl font-semibold mb-4 text-white">
            Welcome{" "}
            {userDetails.firstName ? userDetails.firstName : userDetails.email}
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
  );
};

export default UserWelcome;
