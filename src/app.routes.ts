import { AuthGuard } from '@/shared/guards/auth.guard';
import { LoginGuard } from '@/shared/guards/login.guard';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    // Ruta por defecto - Ahora redirige al dashboard dentro del layout
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Ruta de login (comentada por ahora)
    {
        path: 'login',
        canActivate: [LoginGuard],
        loadComponent: () => import('./app/features/auth/login/login.component').then((m) => m.LoginComponent)
    },

    // Layout principal con rutas hijas
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () => import('./app/layout/component/app.layout').then((m) => m.AppLayout),
        children: [
            // Dashboard como página principal dentro del layout
            {
                path: '',
                loadComponent: () => import('./app/features/dashboard/components/dashboard.component').then((m) => m.DashboardComponent)
            },
            // Rutas de clientes como hijas del layout
            {
                path: 'parqueadero',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./app/features/parqueadero/components/index/index.component').then((m) => m.IndexComponent)
                    },
                    {
                        path: 'nuevo',
                        loadComponent: () => import('./app/features/parqueadero/components/form/form.component').then((m) => m.FormComponent)
                    },
                    {
                        path: 'editar/:id',
                        loadComponent: () => import('./app/features/parqueadero/components/form/form.component').then((m) => m.FormComponent)
                    }
                ]
            }
        ]
    },
    // Ruta para página no encontrada
    {
        path: '**',
        loadComponent: () => import('./app/features/notfound/notfound.component').then((m) => m.NotfoundComponent)
    }
];
