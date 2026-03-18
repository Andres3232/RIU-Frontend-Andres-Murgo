import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () => import('./super-hero/pages/home-page/home-page'),
  },
  {
    path: 'hero/:id',
    loadComponent: () => import('./super-hero/pages/details-page/hero-details'),
  },
  {
    path: '**',
    redirectTo: 'home',
  }

];
