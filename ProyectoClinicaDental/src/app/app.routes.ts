import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1', // Inicio
        loadComponent: () => import('./tab1/tab1.page').then(m => m.Tab1Page)
      },
      {
        path: 'tab2', // Citas
        loadComponent: () => import('./tab2/tab2.page').then(m => m.Tab2Page)
      },
      {
        path: 'tab3', // Ubicación
        loadComponent: () => import('./tab3/tab3.page').then(m => m.Tab3Page)
      },
      {
        path: 'tab4', // Gamificación (Progreso)
        loadComponent: () => import('./tab4/tab4.page').then(m => m.Tab4Page)
      },
      {
        path: 'tab5', // Historial de Citas
        loadComponent: () => import('./tab5/tab5.page').then(m => m.Tab5Page)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
