import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { notifications, sparkles } from 'ionicons/icons';

@Component({
  selector: 'app-tab6',
  templateUrl: 'tab6.page.html',
  styleUrls: ['tab6.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton
  ],
})
export class Tab6Page {
  notifActive: boolean = false;

  constructor(private router: Router) {
    addIcons({ notifications, sparkles });
  }

  viewProfile() {
    this.router.navigate(['/tabs/tab6']);
  }

  toggleNotification() {
    this.notifActive = !this.notifActive;
  }

  goToProfile() {
  console.log('Navegando al perfil del usuario...');
  }
}
