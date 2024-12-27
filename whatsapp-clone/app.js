import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { 
    collection, addDoc, onSnapshot, query, orderBy, Timestamp 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Fonction pour générer une couleur unique basée sur l'email
function generateAvatarColor(email) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`; // Couleur HSL unique
    return color;
}

// Gestion de l'état de connexion
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("chat-container").style.display = "flex";
        loadMessages(); // Charger les messages
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("chat-container").style.display = "none";
    }
});

// Charger les messages
function loadMessages() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            messagesDiv.innerHTML = "<p>Aucun message à afficher.</p>";
            return;
        }

        messagesDiv.innerHTML = ""; // Réinitialise les messages
        snapshot.forEach((doc) => {
            const message = doc.data();

            // Vérification des champs essentiels
            if (!message.text || !message.user || !message.timestamp) {
                console.warn("Document Firestore invalide :", doc.id);
                return;
            }

            // Conteneur principal du message
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", message.user === auth.currentUser.email ? "sent" : "received");

            // Création de l'avatar
            const avatarDiv = document.createElement("div");
            avatarDiv.classList.add("avatar");
            avatarDiv.textContent = message.user.charAt(0).toUpperCase(); // Initiale de l'email
            avatarDiv.style.backgroundColor = generateAvatarColor(message.user);

            // Création de la bulle de message
            const bubbleDiv = document.createElement("div");
            bubbleDiv.classList.add("message-bubble");

            // Vérification et conversion du timestamp
            const time = message.timestamp.toDate
                ? message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "Invalid Date";

            bubbleDiv.innerHTML = `
                ${message.text || `<img src="${message.image}" alt="Image" style="max-width: 100%; border-radius: 8px;">`}
                <br><small>${time}</small>
            `;

            // Ajout des composants au message
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(bubbleDiv);
            messagesDiv.appendChild(messageDiv);
        });
    }, (error) => {
        console.error("Erreur lors de la récupération des messages :", error);
    });
}

// Inscription
document.getElementById("signup-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Inscription réussie !");
    } catch (error) {
        alert(`Erreur : ${error.message}`);
    }
});

// Connexion
document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
    } catch (error) {
        alert(`Erreur : ${error.message}`);
    }
});

// Déconnexion
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Déconnexion réussie !");
    } catch (error) {
        alert(`Erreur : ${error.message}`);
    }
});

// Envoyer un message
document.getElementById("send-btn").addEventListener("click", async () => {
    const text = document.getElementById("message-input").value;

    if (text.trim() !== "") {
        try {
            await addDoc(collection(db, "messages"), {
                text,
                user: auth.currentUser.email,
                timestamp: Timestamp.now()
            });
            document.getElementById("message-input").value = ""; // Réinitialise le champ de saisie
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
});
