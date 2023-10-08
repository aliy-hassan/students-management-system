import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD1C8dFlwgcnQKuU5Dz-7sw7LiqS_y6twk",
    authDomain: "students-management-syst-79cea.firebaseapp.com",
    projectId: "students-management-syst-79cea",
    storageBucket: "students-management-syst-79cea.appspot.com",
    messagingSenderId: "554461256462",
    appId: "1:554461256462:web:0b49989de933ea74a8155f"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);