import { AuthService } from '@/features/auth/services/auth.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = localStorage.getItem('token');

    let headers = req.headers.set('Content-Type', 'application/json');

    if (token) {
        headers = headers.set('Authorization', `JWT ${token}`);
    }

    const authReq = req.clone({ headers });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        const newToken = authService.getToken();
                        const newAuthReq = req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                        });
                        return next(newAuthReq);
                    }),
                    catchError(() => {
                        authService.logOut();
                        return throwError(() => error);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
