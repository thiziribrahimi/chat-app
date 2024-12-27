import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBTtxQOaNca0BCLGUhV4KUwJCUHiCHtDN0",
    authDomain: "whatsapp-clone-2d2b3.firebaseapp.com",
    projectId: "whatsapp-clone-2d2b3",
    storageBucket: "whatsapp-clone-2d2b3.firebasestorage.app",
    messagingSenderId: "1040283251071",
    appId: "1:1040283251071:web:0cfbe5e6afcc6b63d5ea4a",
    measurementId: "G-M8WTTZDVMK"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
