import firebase from 'firebase/compat/app';
import {
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  doc, 
  addDoc,
  collection
} from 'firebase/firestore';

// import { getFirestore } from 'firebase/firestore';

// import { Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = getAuth();
export const dbService = getFirestore();
export const fbFunction = {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
};
export const dbFunction = {doc, addDoc, collection};