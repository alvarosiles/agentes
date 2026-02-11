import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYrX_8ZrflR7-ynhEZP4mBQKpXqZNPCc4",
  authDomain: "prueba-crud-f6b90.firebaseapp.com",
  projectId: "prueba-crud-f6b90",
  storageBucket: "prueba-crud-f6b90.firebasestorage.app",
  messagingSenderId: "25178361233",
  appId: "1:25178361233:web:b508f60de355ba65061e30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const coleccion = "tbl_empleados";

export const addEmpleado = (data) =>
  addDoc(collection(db, coleccion), data);

export const getEmpleados = () =>
  getDocs(collection(db, coleccion));

export const getEmpleado = (id) =>
  getDoc(doc(db, coleccion, id));

export const updateEmpleado = (id, data) =>
  updateDoc(doc(db, coleccion, id), data);

export const deleteEmpleado = (id) =>
  deleteDoc(doc(db, coleccion, id));
