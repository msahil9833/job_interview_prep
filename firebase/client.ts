// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAanNWS-Qj1_oPs0RL-w1Of14qynnN2RXg",
    authDomain: "prepwise-946e3.firebaseapp.com",
    projectId: "prepwise-946e3",
    storageBucket: "prepwise-946e3.firebasestorage.app",
    messagingSenderId: "1073021592050",
    appId: "1:1073021592050:web:0e3d943d7d021d8da9cb6b",
    measurementId: "G-4VBGYS18SH"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp() ;

export const auth = getAuth(app);
export const  db = getFirestore(app)
