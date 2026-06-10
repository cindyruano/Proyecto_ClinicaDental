import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Para usar [(ngModel)]
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonPopover } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import {
  notifications,
  sparkles,
  ellipsisVertical,
  chatboxEllipsesOutline,
  timeOutline,
  happyOutline,
  arrowForwardCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-tab7',
  templateUrl: 'tab7.page.html',
  styleUrls: ['tab7.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonPopover
  ],
})
export class Tab7Page {
  notifActive: boolean = false;
  chatMessage: string = ''; // Almacena el texto dinámico del input

  constructor(private router: Router) {
    addIcons({
      notifications,
      sparkles,
      ellipsisVertical,
      chatboxEllipsesOutline,
      timeOutline,
      happyOutline,
      arrowForwardCircle
    });
  }

  viewProfile() {
    this.router.navigate(['/tabs/tab6']);
  }

  toggleNotification() {
    this.notifActive = !this.notifActive;
  }


  sendMessage() {
    if (this.chatMessage.trim()) {
      console.log('Mensaje enviado a la IA:', this.chatMessage);
      this.chatMessage = ''; // Limpia el campo tras enviar
    }
  }

  selectSuggestion(question: string) {
    this.chatMessage = question; // Pega la sugerencia en el input para el usuario
  }

  openEmojiPicker() {
    console.log('Abriendo selector de emojis...');
  }

  createNewChat() { console.log('Iniciando una nueva conversación...'); }
  openHistory() { console.log('Abriendo el historial...'); }
  goToProfile() { console.log('Navegando al perfil...'); }
}
