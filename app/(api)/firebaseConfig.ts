import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxMf3oKo6-D-XfO7I5ztnRY951WtCL2k",
  authDomain: "profile-29971.firebaseapp.com",
  databaseURL:
    "https://profile-29971-default-rtdb.asia-southeast1.firebasedatabase.app/", // Updated URL
  projectId: "profile-29971",
  storageBucket: "profile-29971.appspot.com",
  messagingSenderId: "929031932923",
  appId: "1:929031932923:android:97ff76d4259e73209a195e",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Re-export ref and set for easy access
export { database, ref, set };
