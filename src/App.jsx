import { Route, Routes } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./components/firebase";
import Accueil from "./components/Accueil";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import NavLog from "./components/NavLog";
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
        </Routes>
        <ToastContainer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
