import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, map, Observable, switchMap, tap, throwError} from 'rxjs';
import {environment} from 'src/environments/environment';

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
        return this.http.post<any>(`${this.baseURL}/logout`, {}).pipe(
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
        return this.http.post<any>(`${this.baseURL}/login`, {email, password}).pipe(
            tap((response) => {
                // Guardar el token si está disponible
                if (response) {
                    localStorage.setItem('token', response.access_token);
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
        return this.http.post<any>(`${this.baseURL}/profile`, {}).pipe(
            tap((profile) => {
                // Guardar el nombre completo del usuario
                if (profile.name) {
                    localStorage.setItem('userName', `${profile.name}`);
                } else {
                    localStorage.setItem('userName', 'Usuario');
                }

                // Guardar información adicional del usuario
                if (profile.created_at) {
                    localStorage.setItem('userLastLogin', profile.created_at);
                }

                // Guardar configuración del perfil
                if (profile.name) {
                    localStorage.setItem('userProfile', JSON.stringify(profile.name));

                    // Guardar configuraciones específicas
                    if (profile.created_at) {
                        localStorage.setItem('userTimezone', profile.created_at);
                    }
                    if (profile.email) {
                        localStorage.setItem('userTheme', profile.email);
                    }
                    if (profile.email) {
                        localStorage.setItem('userLang',"español");
                    }
                    if (profile.name) {
                        localStorage.setItem('userAvatar', profile.name);
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
