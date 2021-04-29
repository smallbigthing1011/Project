import firebase from "firebase";
import "firebase/storage";

export const app = firebase.initializeApp({
  projectId: "hellothereupdown",
  appId: "1:196338772016:web:3df4b0679e9b60d9d425f5",
  storageBucket: "hellothereupdown.appspot.com",
  locationId: "us-central",
  apiKey: "AIzaSyD9zHZZM5gDfuEbNQbwcWE4Nz3_6EOYcYo",
  authDomain: "hellothereupdown.firebaseapp.com",
  messagingSenderId: "196338772016",
  measurementId: "G-3ERZY6VWSF",
});
