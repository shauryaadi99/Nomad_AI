// Import required Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoifdoqvNxpdIDbAI3MAWFDCwDSgBzCOc",
  authDomain: "nomadly-d2fa1.firebaseapp.com",
  projectId: "nomadly-d2fa1",
  storageBucket: "nomadly-d2fa1.appspot.com",
  messagingSenderId: "330664322016",
  appId: "1:330664322016:web:b7b752f6331745b8094185",
  measurementId: "G-T7Y3DX8NSN"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

export const app = initializeApp(firebaseConfig);
// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication
// export const auth = getAuth(app);
