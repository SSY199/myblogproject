// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "myblogweb-a7234.firebaseapp.com",
  projectId: "myblogweb-a7234",
  storageBucket: "myblogweb-a7234.appspot.com",
  messagingSenderId: "934350343347",
  appId: "1:934350343347:web:2b5f923db689c564bfb4c6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);