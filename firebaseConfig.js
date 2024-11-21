import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDDP-cdhKyn-ETT27ltJbuDsuwS0ydMg1s",
  authDomain: "hydriomind.firebaseapp.com",
  projectId: "hydriomind",
  storageBucket: "hydriomind.firebasestorage.app",
  messagingSenderId: "620399659786",
  appId: "1:620399659786:web:0424668fc58c4d4a5e88f3",
  measurementId: "G-VRSLHBW854"
};

const app = initializeApp(firebaseConfig);

let auth;
if (typeof window === "undefined") {
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(app);
}

const database = getFirestore(app);

export { auth, database };