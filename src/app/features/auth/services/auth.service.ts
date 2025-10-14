import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
    http = inject(HttpClient);
    baseURL = environment.BASE_URL + '/auth';

    refreshToken(): Observable<string> {
        const refreshToken = localStorage.getItem('refreshToke');

        if (!refreshToken) {
            this.logOut();
            return throwError(() => new Error('No refresh token found'));
        }
        return this.http.post<{ refreshToken: string }>(`${this.baseURL}/refresh/`, { refreshToken }).pipe(
            map((response) => response.refreshToken),
            tap((newAccessToken) => {
                localStorage.setItem('token', newAccessToken);
            }),
            catchError((error) => {
                this.logOut();
                return throwError(() => error);
            })
        );
    }

    logOut() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    logOutApi(): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/logout/`, {}).pipe(
            tap(() => {
                this.logOut();
            })
        );
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/login/`, { email, password });
    }

    getToken(): string | null {
        const encryptedToken = sessionStorage.getItem('token');
        return encryptedToken;
    }
}
