import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login Toku',
  },
  {
    path: '',
    component: AppLayoutComponent,
    //canActivate: [authGuard], --desactivado mientras se pruebas las nuevas opciones
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard-seller/dashboard-seller.component').then(
            (m) => m.DashboardSellerComponent
          ),
        title: 'Dashboard Comercio',
      }
    ],
  },
];
