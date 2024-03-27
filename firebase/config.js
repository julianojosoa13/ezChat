// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';     
import {collection, initializeFirestore} from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  // authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  // projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  // storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  // messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  // appId: Constants.expoConfig?.extra?.firebaseAppId,
  apiKey: "AIzaSyDQj1V8sohL3p6DzXsP9lRrEEpTtQa6IxI",
  authDomain: "ezchat-91dc6.firebaseapp.com",
  projectId: "ezchat-91dc6",
  storageBucket: "ezchat-91dc6.appspot.com",
  messagingSenderId: "138051793420",
  appId: "1:138051793420:web:526da279aaedab235b7429",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
})
export const userRef = collection(db, "Users")
export const chatRef = collection(db, "Chats")