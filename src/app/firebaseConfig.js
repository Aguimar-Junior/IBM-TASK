// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNFmlSYEgZ893lecsMAwSUYV8ZK7-D3ys",
  authDomain: "ibm-task-8d07c.firebaseapp.com",
  databaseURL: "https://ibm-task-8d07c-default-rtdb.firebaseio.com",
  projectId: "ibm-task-8d07c",
  storageBucket: "ibm-task-8d07c.appspot.com",
  messagingSenderId: "405240315899",
  appId: "1:405240315899:web:f00a462a6cec7901dd955e"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Exportação de instâncias do Firebase
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
