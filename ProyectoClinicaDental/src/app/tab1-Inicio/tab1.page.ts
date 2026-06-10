import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward, notifications, happy, calendarClear, chatbubbleEllipses, headset, addOutline, bulbOutline } from 'ionicons/icons';

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

  promociones = [
    {
      title: 'Blanqueamiento Diamond',
      desc: 'El comentario personalizado que ingrese el dentista desde la web para blanqueamiento.',
      img: 'assets/imagen/descuento.webp'
    },
    {
      title: 'Limpieza Dental 2x1',
      desc: 'El comentario personalizado que ingrese el dentista desde la web para limpieza.',
      img: 'assets/imagen/descuento.webp'
    }
  ];

  proximaCita = {
    fecha: 'Lunes, 12 de Oct',
    hora: '10:00 AM',
    doctor: 'Dr. Aris',
    especialidad: 'Especialista en Ortodoncia'
  };

  tipDeLaSemana: string = 'Recuerda usar el hilo dental después de comidas principales. Tu esmalte lo agradecerá.';

  constructor(private router: Router) {
    addIcons({ chevronForward, notifications, happy, calendarClear, chatbubbleEllipses, headset, addOutline, bulbOutline });
  }

  // Métodos de navegación y acciones de tu lógica original
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

  verDetallePromo(promo: any) {
    console.log('Ver detalle de:', promo.title);
    console.log('Comentario del dentista:', promo.desc);
  }
}
