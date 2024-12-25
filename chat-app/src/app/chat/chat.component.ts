import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent {
  messages = [
    { sender: 'User1', message: 'Hello!' },
    { sender: 'User2', message: 'Hi there!' }
  ]; // Exemple de messages pour le test

  newMessage = ''; // Variable pour stocker le message entré par l'utilisateur

  sendMessage() {
    // Méthode pour envoyer un message
    if (this.newMessage.trim()) {
      this.messages.push({ sender: 'Me', message: this.newMessage });
      this.newMessage = ''; // Réinitialise l'entrée après l'envoi
    }
  }
}
