import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Sélection des éléments HTML
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// Inscription d'un nouvel utilisateur
signupBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Inscription réussie !");
    } catch (error) {
        alert(`Erreur : ${error.message}`);
    }
});

// Connexion d'un utilisateur existant
loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
    } catch (error) {
        alert(`Erreur : ${error.message}`);
    }
});

// Vérification de l'état de connexion de l'utilisateur
onAuthStateChanged(auth, (user) => {
    if (user) {
        // L'utilisateur est connecté
        authContainer.style.display = "none";
        chatContainer.style.display = "block";
        loadMessages();
    } else {
        // L'utilisateur est déconnecté
        authContainer.style.display = "block";
        chatContainer.style.display = "none";
    }
});

// Fonction pour envoyer un message
sendBtn.addEventListener("click", async () => {
    const text = messageInput.value;

    if (text.trim() !== "") {
        try {
            const user = auth.currentUser;
            await addDoc(collection(db, "messages"), {
                text: text,
                user: user.email,
                timestamp: new Date()
            });
            messageInput.value = "";
        } catch (error) {
            alert(`Erreur lors de l'envoi du message : ${error.message}`);
        }
    } else {
        alert("Le message ne peut pas être vide.");
    }
});

// Fonction pour charger les messages en temps réel
function loadMessages() {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = ""; // Efface les anciens messages
        snapshot.forEach((doc) => {
            const message = doc.data();
            const messageDiv = document.createElement("div");
            messageDiv.textContent = `${message.user}: ${message.text}`;
            messagesDiv.appendChild(messageDiv);
        });
    });
}
