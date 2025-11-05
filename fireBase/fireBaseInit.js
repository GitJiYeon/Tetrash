// fireBaseInit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0_6Nq0oLxI755w68_HVursn8TyII02g4",
  authDomain: "tetrash-c8eeb.firebaseapp.com",
  projectId: "tetrash-c8eeb",
  storageBucket: "tetrash-c8eeb.appspot.com",
  messagingSenderId: "667172158105",
  appId: "1:667172158105:web:90ee61071f47234c745608",
  measurementId: "G-MXZQPHW1GG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


window.auth = auth;