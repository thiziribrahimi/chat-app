import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Fonction pour générer une couleur unique pour les avatars
function generateAvatarColor(email) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
}

// Gestion de l'état de connexion
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("chat-container").style.display = "flex";
        loadMessages();
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("chat-container").style.display = "none";
    }
});

// Inscription
document.getElementById("signup-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign-up successful!");
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Connexion
document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Déconnexion
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logout successful!");
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Charger les messages
function loadMessages() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = "";
        snapshot.forEach((doc) => {
            const message = doc.data();

            // Conteneur principal du message
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", message.user === auth.currentUser.email ? "sent" : "received");

            // Avatar
            const avatarDiv = document.createElement("div");
            avatarDiv.classList.add("avatar");
            avatarDiv.textContent = message.user.charAt(0).toUpperCase();
            avatarDiv.style.backgroundColor = generateAvatarColor(message.user);

            // Bulle de message
            const bubbleDiv = document.createElement("div");
            bubbleDiv.classList.add("message-bubble");

            const time = message.timestamp?.toDate
                ? new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "Invalid Date";

            bubbleDiv.innerHTML = `
                ${message.text || `<img src="${message.image}" alt="Image" style="max-width: 100%; border-radius: 8px;">`}
                <br><small>${time}</small>
            `;

            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(bubbleDiv);
            messagesDiv.appendChild(messageDiv);
        });
    });
}

// Envoyer un message
document.getElementById("send-btn").addEventListener("click", async () => {
    const text = document.getElementById("message-input").value;

    if (text.trim() !== "") {
        await addDoc(collection(db, "messages"), {
            text,
            user: auth.currentUser.email,
            timestamp: Timestamp.now()
        });
        document.getElementById("message-input").value = "";
    }
});

// Gestion des émojis
const emojiPicker = document.getElementById("emoji-picker");
const emojiBtn = document.getElementById("emoji-btn");
const messageInput = document.getElementById("message-input");

// Liste d'émojis pour le picker
const emojis = ["😀", "😂", "😍", "😭", "👍", "🎉", "❤️", "😎", "😡", "🙏", "🔥", "🥳", "💔", "🤔", "😢"];

// Afficher/Masquer le sélecteur d'émojis
emojiBtn.addEventListener("click", () => {
    if (emojiPicker.style.display === "none" || !emojiPicker.style.display) {
        emojiPicker.style.display = "block";
        populateEmojiPicker();
    } else {
        emojiPicker.style.display = "none";
    }
});

// Ajouter les émojis au picker
function populateEmojiPicker() {
    emojiPicker.innerHTML = ""; 
    emojis.forEach((emoji) => {
        const emojiButton = document.createElement("button");
        emojiButton.textContent = emoji;
        emojiButton.classList.add("emoji-btn");
        emojiButton.addEventListener("click", () => {
            messageInput.value += emoji;
            emojiPicker.style.display = "none"; 
        });
        emojiPicker.appendChild(emojiButton);
    });
}
