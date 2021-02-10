import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyBSO1l02gRubi7mZnIWhkxMcuXE-oMu33g",
  authDomain: "converse-dd75d.firebaseapp.com",
  databaseURL: "https://converse-dd75d.firebaseio.com",
  projectId: "converse-dd75d",
  storageBucket: "converse-dd75d.appspot.com",
  messagingSenderId: "984079997699",
  appId: "1:984079997699:web:3563204ba0a57051c82736",
  measurementId: "G-MVFD08GGD1",
});

const db = firebase.database().ref("Cordion");
const auth = firebase.auth();

export { firebase, db, auth };
