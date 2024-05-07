// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiDCkW7B81xxik0R2Dm8q95S0Q6Ejsl2c",
  authDomain: "login-auth-d6c7d.firebaseapp.com",
  projectId: "login-auth-d6c7d",
  storageBucket: "login-auth-d6c7d.appspot.com",
  messagingSenderId: "453056402183",
  appId: "1:453056402183:web:a7449893ac8289e2beeba2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const auth = getAuth();
export const db = getFirestore(app);
export default app;
