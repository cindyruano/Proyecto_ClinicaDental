import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonDatetime, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, sparkles, medkit, chevronBackOutline, chevronForwardOutline, calendarNumberOutline, calendarClearOutline, checkmarkCircleOutline, colorWandOutline, bandageOutline, pulseOutline, sparklesOutline, medkitOutline } from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonIcon, IonButton, IonDatetime ],
})
export class Tab2Page {
  @ViewChild('datetimePicker', { static: false }) datetimePicker!: IonDatetime;

  notifActive: boolean = false;
  tratamientoSeleccionado: string = 'ortodoncia';

  // Variables del Calendario
  currentDate: Date = new Date();
  currentMonthName: string = '';
  currentYear: number = 2026;
  blankDays: number[] = [];
  daysInMonth: number[] = [];
  selectedDay: number = 14;
  selectedMonth: number = 4;
  selectedYear: number = 2024;

  // Lógica de Horarios Disponibles
  selectedSlot: string = '10:00';
  availableSlots: Array<{ time: string; disabled: boolean }> = [
    { time: '09:00', disabled: false },
    { time: '10:00', disabled: false },
    { time: '11:30', disabled: false },
    { time: '12:00', disabled: true },
    { time: '15:00', disabled: false },
    { time: '16:30', disabled: false }
  ];

  constructor(private router: Router) {
    addIcons({
      notifications,
      sparklesOutline,
      medkitOutline,
      chevronBackOutline,
      chevronForwardOutline,
      calendarNumberOutline,
      calendarClearOutline,
      colorWandOutline,
      bandageOutline,
      pulseOutline,
      checkmarkCircleOutline
    });
    this.generateCalendar();
  }


  viewProfile() {
    this.router.navigate(['/tabs/tab6']);
  }

  toggleNotification() {
    this.notifActive = !this.notifActive;
  }

  selectSlot(time: string) {
    this.selectedSlot = time;
  }

  addToCalendar() {
    console.log('Abriendo opciones para agregar a Google/Apple Calendar...');
  }

  confirmAppointment() {
    console.log(`Cita confirmada para el ${this.selectedDay}/${this.selectedMonth + 1}/${this.selectedYear} a las ${this.selectedSlot}`);
  }

  // --- Métodos del calendario y flujos anteriores se mantienen intactos ---
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentYear = year;
    this.currentMonthName = this.currentDate.toLocaleString('es-ES', { month: 'long' });
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalBlankDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const prevMonthDaysTotal = new Date(year, month, 0).getDate();
    this.blankDays = [];
    for (let i = totalBlankDays - 1; i >= 0; i--) { this.blankDays.push(prevMonthDaysTotal - i); }
    const totalDays = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = [];
    for (let i = 1; i <= totalDays; i++) { this.daysInMonth.push(i); }
  }
  prevMonth() { this.currentDate.setMonth(this.currentDate.getMonth() - 1); this.generateCalendar(); }
  nextMonth() { this.currentDate.setMonth(this.currentDate.getMonth() + 1); this.generateCalendar(); }
  openMonthYearPicker() { const datetimeEl = document.querySelector('.hidden-picker') as any; if (datetimeEl) { datetimeEl.click(); } }
  onMonthYearChange(event: any) { const selectedDateValue = new Date(event.detail.value); this.currentDate = selectedDateValue; this.generateCalendar(); }
  selectDate(day: number) { this.selectedDay = day; this.selectedMonth = this.currentDate.getMonth(); this.selectedYear = this.currentDate.getFullYear(); }
  isSelected(day: number): boolean { return this.selectedDay === day && this.selectedMonth === this.currentDate.getMonth() && this.selectedYear === this.currentDate.getFullYear(); }
  seleccionar(tipo: string) { this.tratamientoSeleccionado = tipo; }
  goToProfile() { console.log('Navegando al perfil...'); }
  viewMoreTreatments() { console.log('Mostrando tratamientos...'); }
}
