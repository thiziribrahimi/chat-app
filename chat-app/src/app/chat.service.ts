import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

  getMessages() {
    return this.firestore.collection('chats', ref => ref.orderBy('timestamp')).valueChanges();
  }

  sendMessage(sender: string, message: string) {
    return this.firestore.collection('chats').add({
      sender,
      message,
      timestamp: new Date()
    });
  }
}
