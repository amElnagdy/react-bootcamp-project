import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyDtvs3HrOvT5H3oScNlPgeZmEBzyaBRxnE",
  authDomain: "bootcamp-project-6b167.firebaseapp.com",
  databaseURL: "https://bootcamp-project-6b167.firebaseio.com",
  projectId: "bootcamp-project-6b167",
  storageBucket: "bootcamp-project-6b167.appspot.com",
  messagingSenderId: "265144349339",
  appId: "1:265144349339:web:608001983583959de44c3e",
};

firebase.initializeApp(config);
export default firebase;
