import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import {
  arrowBackOutline,
  locateOutline,
  layersOutline,
  checkmarkCircle,
  location,
  call,
  time,
  navigateCircleOutline
} from 'ionicons/icons';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation'; // Importamos la geolocalización nativa

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton
  ],
})
export class Tab3Page implements OnInit, OnDestroy {
  private map!: L.Map;
  private clinicaCoords: [number, number] = [14.6349, -90.5069];
  private userMarker?: L.Marker;

  // Variable de control para la tarjeta
  isCardHidden: boolean = false;

  // Definición de las Capas de Mapa
  private lightLayer!: L.TileLayer;
  private satelliteLayer!: L.TileLayer;
  private isSatelliteActive: boolean = false;

  constructor(private router: Router, private toastController: ToastController) {
    addIcons({
      arrowBackOutline,
      locateOutline,
      layersOutline,
      checkmarkCircle,
      location,
      call,
      time,
      navigateCircleOutline
    });
  }

  ngOnInit() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);
  }

  ionViewDidEnter() {
    this.initMap();
  }

  initMap() {
    this.lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap'
    });

    this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });

    this.map = L.map('map', {
      center: this.clinicaCoords,
      zoom: 15,
      zoomControl: false,
      layers: [this.lightLayer]
    });

    // 3. Crear marcador personalizado de la clínica
    const customIcon = L.divIcon({
      html: `
        <div style="
          background-color: #001b3d;
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,27,61,0.35);
          border: 2px solid white;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 18px;">🦷</div>
        </div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const clinicMarker = L.marker(this.clinicaCoords, { icon: customIcon }).addTo(this.map);


  // =========================================================
    // EVENTOS DEL MAPA PARA OCULTAR/MOSTRAR LA TARJETA
    // =========================================================

    // A. Detectar cuando el usuario arrastra o mueve el mapa
    this.map.on('dragstart', () => {
      // Usamos setTimeout para que Angular detecte el cambio de estado correctamente
      setTimeout(() => {
        this.isCardHidden = true;
      }, 0);
    });

    // B. Detectar cuando el usuario hace clic en el marcador de la clínica
    clinicMarker.on('click', () => {
      setTimeout(() => {
        this.isCardHidden = false;
        // Centrar suavemente el mapa en la clínica al tocar el marcador
        this.map.setView(this.clinicaCoords, 15, { animate: true });
      }, 0);
    });
  }
  // ==========================================
  // FUNCIONALIDAD 1: GEOLOCALIZACIÓN DEL USUARIO
  // ==========================================
  // ==========================================
  // GEOLOCALIZACIÓN DEL USUARIO (Ajustada)
  // ==========================================
  async recenterToUser() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      const userLat = coordinates.coords.latitude;
      const userLng = coordinates.coords.longitude;
      const userLatLng: [number, number] = [userLat, userLng];

      // 1. Centrar mapa en el usuario
      this.map.setView(userLatLng, 16, { animate: true, duration: 1.5 });

      if (this.userMarker) {
        this.userMarker.remove();
      }

      const userIcon = L.divIcon({
        html: `
          <div style="
            background-color: #3880ff;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(56, 128, 255, 0.8);
          "></div>
        `,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      this.userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(this.map);

      // 2. ¡CLAVE!: Volvemos a mostrar la tarjeta de información para que el usuario
      // tenga a la mano la opción de "Cómo llegar" o regresar a la clínica
      setTimeout(() => {
        this.isCardHidden = false;
      }, 500);

      this.presentToast('Ubicación encontrada');
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
      this.presentToast('Activa el GPS para ver tu ubicación actual.');
    }
  }

  // =========================================================
  // FUNCIÓN NUEVA: REGRESAR DE INMEDIATO A LA CLÍNICA
  // =========================================================
  recenterToClinic() {
    // Hace un paneo suave de regreso a la clínica y abre su información
    this.map.setView(this.clinicaCoords, 15, { animate: true, duration: 1.2 });
    setTimeout(() => {
      this.isCardHidden = false;
    }, 300);
  }

  // ==========================================
  // FUNCIONALIDAD 2: ALTERNAR TIPO DE MAPA (Capas)
  // ==========================================
  toggleMapLayer() {
    if (this.isSatelliteActive) {
      // Cambiar a diseño de mapa claro estándar
      this.map.removeLayer(this.satelliteLayer);
      this.map.addLayer(this.lightLayer);
      this.isSatelliteActive = false;
      this.presentToast('Vista del mapa clásico');
    } else {
      // Cambiar a diseño satelital de alta resolución
      this.map.removeLayer(this.lightLayer);
      this.map.addLayer(this.satelliteLayer);
      this.isSatelliteActive = true;
      this.presentToast('Vista de satélite activada');
    }
  }

  // Helper para mostrar notificaciones rápidas en pantalla
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'custom-toast' // Quitamos 'style' para evitar el error de compilación
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  viewProfile() {
    this.router.navigate(['/tabs/tab6']);
  }

  openNavigation() {
    const lat = this.clinicaCoords[0];
    const lng = this.clinicaCoords[1];
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_system');
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
    const link = document.getElementById('leaflet-css');
    if (link) {
      link.remove();
    }
  }
}


