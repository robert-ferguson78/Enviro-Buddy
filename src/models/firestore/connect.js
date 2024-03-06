import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import dotenv from "dotenv";

import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue, Filter } from "firebase-admin/firestore";

// starting .env
dotenv.config();

// initializeApp({
//   credential: applicationDefault()
// });

// const db = getFirestore();


// setting keys for firebase auth 
const firebaseConfig = {
    apiKey: process.env.api_key,
    authDomain: process.env.auth_domain,
    projectId: process.env.project_id,
    storageBucket: process.env.storage_bucket,
    messagingSenderId: process.env.messaging_sender_id,
    appId: process.env.app_id,
    measurementId: process.env.measurement_id
  };
 
// // initialisating database with config
initializeApp(firebaseConfig);

// // setting firestore to export
const db = firebase.firestore();

export { db };