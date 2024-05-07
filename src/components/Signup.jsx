import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth , db} from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Header from "./Header";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      console.log('User Registered Successfully!!', result.user);
      window.location.href = "/accueil";
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });

      console.log('LOGGED USER', result.user);
    } catch (error) {
      console.log(error)
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  }

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      console.log('User Registered Successfully!!', result.user);
      window.location.href = "/accueil";
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });


    } catch (error) {
      console.log(error)
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
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
  <form onSubmit={handleRegister} className="max-w-md mx-auto mt-8 p-6 bg-transparent rounded-lg border-2 border-indigo-500">
    <h3 className="text-xl font-semibold mb-4 text-white">Sign Up</h3>

    <div className="mb-4">
      <label className="block text-sm font-medium text-white">First name</label>
      <input
        type="text"
        className="form-input mt-1 block w-full bg-transparent border border-white rounded text-white"
        placeholder="First name"
        onChange={(e) => setFname(e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-white">Last name</label>
      <input
        type="text"
        className="form-input mt-1 block w-full bg-transparent border border-white rounded text-white"
        placeholder="Last name"
        onChange={(e) => setLname(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-white">Email address</label>
      <input
        type="email"
        className="form-input mt-1 block w-full bg-transparent border border-white rounded text-white"
        placeholder="Enter email"
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
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <button type="submit" className="w-full bg-transparent border-2 border-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-500 hover:text-white">
        Sign Up
      </button>
    </div>

    <p className="text-sm text-white text-right">
      Already registered? <a href="/login" className="text-white hover:underline">Login</a>
    </p>
  </form>

  <div className="mt-4 flex justify-center space-x-2">
    <button onClick={signInWithGoogle} className="bg-transparent border-2 border-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-500 hover:text-white">
      Sign In With Google
    </button>

    <button onClick={signInWithFacebook} className="bg-transparent border-2 border-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-500 hover:text-white">
      Sign In With Facebook
    </button>
  </div>
</>


  
  );
}

export default Signup