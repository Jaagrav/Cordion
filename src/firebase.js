import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyBjuzaHS-svU9tHSQTY2gr4KMnpP16iuQM",
  authDomain: "the-coder-b3e19.firebaseapp.com",
  databaseURL: "https://the-coder-b3e19.firebaseio.com",
  projectId: "the-coder-b3e19",
  storageBucket: "the-coder-b3e19.appspot.com",
  messagingSenderId: "978497464036",
  appId: "1:978497464036:web:818f87aaa099447306eef1",
  measurementId: "G-LTTYCTFXXP",
});

const db = firebase.database().ref("Cordion");
const auth = firebase.auth();

export { firebase, db, auth };
