import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
    http = inject(HttpClient);
    baseURL = environment.BASE_URL + '/auth';


    logOut() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    logOutApi(): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/logout/`, {}).pipe(
            tap(() => {
                this.logOut();
            }),
            catchError((error) => {
                // Incluso si hay error en el logout del servidor, hacer logout local
                this.logOut();
                return throwError(() => error);
            })
        );
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/login/`, { email, password }).pipe(
            tap((response) => {
                // Guardar el token si está disponible
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
            }),
            // Después del login exitoso, obtener el perfil del usuario
            switchMap(() => this.getUserProfile())
        );
    }

    /**
     * Obtiene el perfil del usuario autenticado
     * @returns Observable<any>
     */
    getUserProfile(): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/user/profile/`, {}).pipe(
            tap((profile) => {
                // Guardar el nombre completo del usuario
                if (profile.first_name && profile.last_name) {
                    localStorage.setItem('userName', `${profile.first_name} ${profile.last_name}`);
                } else if (profile.first_name) {
                    localStorage.setItem('userName', profile.first_name);
                } else if (profile.last_name) {
                    localStorage.setItem('userName', profile.last_name);
                } else {
                    localStorage.setItem('userName', 'Usuario');
                }

                // Guardar información adicional del usuario
                if (profile.last_login) {
                    localStorage.setItem('userLastLogin', profile.last_login);
                }
                
                // Guardar configuración del perfil
                if (profile.profile) {
                    localStorage.setItem('userProfile', JSON.stringify(profile.profile));
                    
                    // Guardar configuraciones específicas
                    if (profile.profile.timezone) {
                        localStorage.setItem('userTimezone', profile.profile.timezone);
                    }
                    if (profile.profile.theme) {
                        localStorage.setItem('userTheme', profile.profile.theme);
                    }
                    if (profile.profile.lang) {
                        localStorage.setItem('userLang', profile.profile.lang);
                    }
                    if (profile.profile.avatar) {
                        localStorage.setItem('userAvatar', profile.profile.avatar);
                    }
                }
                
                // Guardar todo el perfil como JSON para uso futuro
                localStorage.setItem('userFullProfile', JSON.stringify(profile));
            })
        );
    }

    getToken(): string | null {
        const token = localStorage.getItem('token');
        return token;
    }
}
