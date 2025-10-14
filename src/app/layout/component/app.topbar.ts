import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { PopoverModule } from 'primeng/popover';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, PopoverModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <span>CQ | Johany Cruz</span>
            </a>
        </div>

        <div class="layout-topbar-actions flex items-center justify-end h-full">
            <!-- Botón del usuario -->
            <button type="button" class="flex items-center gap-2 py-2 px-3" (click)="userMenu.toggle($event)">
                <!-- Avatar circular con iniciales -->
                <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    <span *ngIf="!userAvatar" class="text-sm">{{ getInitials() }} </span>
                    <img *ngIf="userAvatar" [src]="userAvatar" alt="Avatar" class="w-full h-full rounded-full object-cover" />
                </div>
                <div class="flex items-center">
                    <!-- Nombre del usuario -->
                    <span class="font-medium text-sm flex items-center mr-2">{{ userName }} </span>
                    <!-- Flecha desplegable -->
                    <i class="pi pi-chevron-down text-xs flex items-center"></i>
                </div>
            </button>

            <!-- Panel desplegable del menú de usuario -->
            <p-popover #userMenu>
                <div class="p-4">
                    <div class="flex items-center mb-3">
                        <div class="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white mr-3">
                            <span *ngIf="!userAvatar" class="text-xl font-bold">{{ getInitials() }}</span>
                            <img *ngIf="userAvatar" [src]="userAvatar" alt="Avatar" class="w-full h-full rounded-full object-cover" />
                        </div>
                        <div>
                            <div class="font-semibold text-lg">{{ userName }}</div>
                            <div class="text-sm text-500">{{ formatLastLogin() || 'Usuario del sistema' }}</div>
                        </div>
                    </div>
                    <hr class="my-3" />
                    <button type="button" class="w-full p-button p-button-outlined p-button-danger p-button-sm" (click)="logout(); userMenu.hide()">
                        <i class="pi pi-sign-out mr-2"></i>
                        Cerrar Sesión
                    </button>
                </div>
            </p-popover>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    userName: string = 'Usuario'; // Nombre del usuario logueado
    userLastLogin: string = ''; // Último login del usuario
    userAvatar: string = ''; // Avatar del usuario

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService
    ) {
        // Obtener la información del usuario desde el localStorage
        this.loadUserInfo();
    }

    private loadUserInfo() {
        this.userName = localStorage.getItem('userName') || 'Usuario';
        this.userLastLogin = localStorage.getItem('userLastLogin') || '';
        this.userAvatar = localStorage.getItem('userAvatar') || '';
    }

    getInitials(): string {
        if (!this.userName || this.userName === 'Usuario') return 'U';

        const names = this.userName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        } else if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        return 'U';
    }

    formatLastLogin(): string {
        if (!this.userLastLogin) return '';

        try {
            const date = new Date(this.userLastLogin);
            return `Último acceso: ${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        } catch {
            return `Último acceso: ${this.userLastLogin}`;
        }
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    // Lógica para cerrar sesión
    logout() {
        this.authService.logOutApi().subscribe();
    }
}
