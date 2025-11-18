import { AuthService } from '@/features/auth/services/auth.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    let headers = req.headers;

    // Solo agregar Content-Type si no está presente
    if (!headers.has('Content-Type')) {
        headers = headers.set('Content-Type', 'application/json');
    }

    // Agregar token si existe
    if (token) {
        headers = headers.set('Authorization', `bearer ${token}`);
    }

    const authReq = req.clone({ headers });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('🚨 Error en interceptor:', error.status, 'para:', req.url);
            console.log('‼️Detalles del error:', error);
            if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
                authService.logOut();
            }
            return throwError(() => error);
        })
    );
};
