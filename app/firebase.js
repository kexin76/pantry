// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjI5BBAwljfBVe25WYCEIslJFnir1LBxc",
  authDomain: "pantry-js.firebaseapp.com",
  projectId: "pantry-js",
  storageBucket: "pantry-js.appspot.com",
  messagingSenderId: "559621747098",
  appId: "1:559621747098:web:05078fd53db2abe2d60a23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)