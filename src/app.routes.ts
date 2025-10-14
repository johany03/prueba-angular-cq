import { AuthGuard } from '@/shared/guards/auth.guard';
import { LoginGuard } from '@/shared/guards/login.guard';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        canActivate: [LoginGuard],
        loadComponent: () => import('./app/features/auth/login/login.component').then((m) => m.LoginComponent)
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () => import('./app/layout/component/app.layout').then((m) => m.AppLayout)
    }
];
