import { initializeApp } from "firebase/app";
import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { getDatabase, ref } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCSuWnLwE9ibPtXbOs3q_0KDehmWLoU0Ts",
  authDomain: "atlas-59033.firebaseapp.com",
  projectId: "atlas-59033",
  storageBucket: "atlas-59033.appspot.com",
  messagingSenderId: "1058296947841",
  appId: "1:1058296947841:web:390a51f5d4ee55ce3a9980",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
