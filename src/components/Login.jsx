
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import Header from "./Header";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/accueil";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };
  return (
    <>
  <Header />
  <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-transparent rounded-lg border-2 border-indigo-500">
    <h3 className="text-xl font-semibold mb-4 text-white">Login</h3>

    <div className="mb-4">
      <label className="block text-sm font-medium text-white">Email address</label>
      <input
        type="email"
        className="form-input mt-1 block w-full bg-transparent border border-white rounded text-white"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-white">Password</label>
      <input
        type="password"
        className="form-input mt-1 block w-full bg-transparent border border-white rounded text-white"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <button type="submit" className="w-full bg-transparent border-2 border-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-500 hover:text-white">
        Submit
      </button>
    </div>

    <p className="text-sm text-white text-right">
      New user? <a href="/signup" className="text-white hover:underline">Register Here</a>
    </p>
  </form>
</>

  );
}

export default Login