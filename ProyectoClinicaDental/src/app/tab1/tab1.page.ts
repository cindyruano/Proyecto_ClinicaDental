import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar el Router
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, happy, chevronForwardOutline, chevronBackOutline, calendarClear } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton
  ],
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
    { title: '30% Descuento Limpieza', desc: 'Recupera el brillo de tu sonrisa con nuestra última tecnología.' },
    { title: 'Limpieza Dental 2x1', desc: 'Aprovecha esta promoción por tiempo limitado.' }
  ];

  // Inyectar el Router en el constructor
  constructor(private router: Router) {
    addIcons({
      notifications, happy, calendarClear,
      chevronForwardOutline, chevronBackOutline
    });
  }

  // Función para navegar a la pestaña de Citas (Tab2)
  goToTabs2() {
    this.router.navigate(['/tabs/tab2']);
  }

  // Resto de funciones para evitar errores
  toggleNotification() { this.notifActive = !this.notifActive; }
  goToProfile() { console.log('Perfil'); }
  openHealthDetails() { console.log('Salud'); }
  viewHistory() { console.log('Historial'); }
  viewAppointmentDetails() { console.log('Detalles Cita'); }

  verDetallePromo() {
    console.log('Detalle de la promoción:', this.promociones[this.indiceActual].title);
  }

  // Ir a la siguiente promoción (o volver al inicio si es la última)
nextPromo() {
  if (this.indiceActual < this.promociones.length - 1) {
    this.indiceActual++;
  } else {
    this.indiceActual = 0; // Vuelve al primero
  }
}

// Ir a la anterior (o ir al final si es la primera)
prevPromo() {
  if (this.indiceActual > 0) {
    this.indiceActual--;
  } else {
    this.indiceActual = this.promociones.length - 1; // Va al último
  }
}
}
