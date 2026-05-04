import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, sparkles } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton
  ],
})
export class Tab2Page {
  notifActive: boolean = false;
  tratamientoSeleccionado: string = 'ortodoncia';

  constructor() {
    addIcons({ notifications, sparkles });
  }

  toggleNotification() {
    this.notifActive = !this.notifActive;
  }

  seleccionar(tipo: string) {
    this.tratamientoSeleccionado = tipo;
  }

  goToProfile() {
  console.log('Navegando al perfil del usuario...');
  }

  viewMoreTreatments() {
  console.log('Mostrando catálogo completo de tratamientos...');
  }
}
