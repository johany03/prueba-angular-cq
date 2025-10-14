import { AuthService } from '@/features/auth/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

/**
 * Guard que bloquea acceso al login si ya hay sesión activa.
 */
@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAuthentication();
    }

    private checkAuthentication(): boolean | UrlTree {
        const token = localStorage.getItem('token');
        if (token) {
            return this.router.parseUrl('/dashboard');
        }
        return true;
    }
}
