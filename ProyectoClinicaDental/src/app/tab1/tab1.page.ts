import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, happy, chevronForwardOutline, chevronBackOutline, calendarClear, add, chatbubbleEllipses, headset } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton ],
})
export class Tab1Page {
  userName: string = 'Cindy';
  saludPorcentaje: number = 90;
  notifActive: boolean = false;
  indiceActual: number = 0;

  proximaCita = {
    fecha: 'OCTUBRE 24, 2024',
    hora: '10:30 AM',
    doctor: 'Dr. Aris',
    especialidad: 'Especialista en Ortodoncia'
  };

  promociones = [
    { title: '30% Limpieza', desc: 'Recupera el brillo de tu sonrisa con nuestra última tecnología.' },
    { title: 'Limpieza Dental 2x1', desc: 'Aprovecha esta promoción por tiempo limitado.' }
  ];

  constructor(private router: Router) {
    addIcons({ notifications, happy, calendarClear, chevronForwardOutline, chevronBackOutline, add, chatbubbleEllipses, headset });
  }

  goToHistorialCitas() {
    this.router.navigate(['/tabs/tab5']);
  }

  goToTabs2() {
    this.router.navigate(['/tabs/tab2']);
  }

  agendarCita() {
    console.log('Navegando a agendar cita...');
    this.router.navigate(['/tabs/tab2']);
  }

  chatIA() {
    console.log('Abriendo chat con IA...');
  }

  soporteTecnico() {
    console.log('Abriendo soporte técnico...');
  }

  viewProfile() {
    this.router.navigate(['/tabs/tab6']);
  }

  toggleNotification() {
    this.notifActive = !this.notifActive;
  }

  openHealthDetails() {
    console.log('Salud');
  }

  viewHistory() {
    this.router.navigate(['/tabs/tab5']);
  }

  viewAppointmentDetails() {
    console.log('Detalles Cita');
  }

  verDetallePromo() {
    console.log('Detalle de la promoción:', this.promociones[this.indiceActual].title);
  }

  nextPromo() {
    this.indiceActual = (this.indiceActual < this.promociones.length - 1) ? this.indiceActual + 1 : 0;
  }

  prevPromo() {
    this.indiceActual = (this.indiceActual > 0) ? this.indiceActual - 1 : this.promociones.length - 1;
  }
}
