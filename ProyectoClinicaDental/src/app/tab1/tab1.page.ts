import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, happy, calendarClear, chevronForward, chevronBack, chevronBackOutline, chevronForwardOutline, chatbubbleEllipses, headset, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonRippleEffect ],
})
export class Tab1Page {
  userName: string = 'Cindy';
  saludPorcentaje: number = 75;
  notifActive: boolean = false;
  indiceActual: number = 0;

  promociones = [
    { title: '30% Limpieza', desc: 'Recupera el brillo de tu sonrisa con nuestra última tecnología.' },
    { title: 'Limpieza Dental 2x1', desc: 'Aprovecha esta promoción por tiempo limitado.' }
  ];

  proximaCita = {
    fecha: 'Lunes, 12 de Oct',
    hora: '10:00 AM',
    doctor: 'Dr. Aris',
    especialidad: 'Especialista en Ortodoncia'
  };

  constructor(private router: Router) {
    addIcons({ notifications, happy, calendarClear, chevronForward, chevronBack, chevronBackOutline, chevronForwardOutline, chatbubbleEllipses, headset, addOutline });
  }

  // Métodos de navegación y acciones
  agendarCita() {
    this.router.navigate(['/tabs/tab2']);
  }

  chatIA() {
    this.router.navigate(['/tabs/tab7']);
  }

  soporteTecnico() {
    console.log('Soporte técnico');
  }

  viewProfile() {
    this.router.navigate(['/tabs/tab6']);
  }

  toggleNotification() {
    this.notifActive = !this.notifActive;
  }

  goToHistorialCitas() {
    this.router.navigate(['/tabs/tab5']);
  }

  openHealthDetails() {
    console.log('Detalles salud');
  }

  nextPromo() {
    this.indiceActual = (this.indiceActual < this.promociones.length - 1) ? this.indiceActual + 1 : 0;
  }

  prevPromo() {
    this.indiceActual = (this.indiceActual > 0) ? this.indiceActual - 1 : this.promociones.length - 1;
  }

  verDetallePromo() {
    console.log('Promo:', this.promociones[this.indiceActual].title);
  }
}
