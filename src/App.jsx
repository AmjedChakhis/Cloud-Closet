import { Route, Routes } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Home from "./components/LandingPage/Home";
import Login from "./components/Login&Signup/Login";
import Signup from "./components/Login&Signup/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./components/firebase";
import Accueil from "./components/FilePage/Accueil";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import EditProfile from "./components/EditProfile/EditProfile";
const App = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/accueil" /> : <Home />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
        <ToastContainer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
