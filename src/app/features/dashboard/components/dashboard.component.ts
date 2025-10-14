import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/features/auth/services/auth.service';
import { TagModule } from 'primeng/tag';

@Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [CommonModule, TagModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    userName: string = 'Usuario';
    userEmail: string = '';
    userLastLogin: string = '';
    userAvatar: string = '';
    userTimezone: string = '';
    userTheme: string = '';
    userLang: string = '';

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.loadUserInfo();
    }

    private loadUserInfo() {
        this.userName = localStorage.getItem('userName') || 'Usuario';
        this.userEmail = localStorage.getItem('userEmail') || '';
        this.userLastLogin = localStorage.getItem('userLastLogin') || '';
        this.userAvatar = localStorage.getItem('userAvatar') || '';
        this.userTimezone = localStorage.getItem('userTimezone') || '';
        this.userTheme = localStorage.getItem('userTheme') || '';
        this.userLang = localStorage.getItem('userLang') || '';
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
        if (!this.userLastLogin) return 'No disponible';

        try {
            const date = new Date(this.userLastLogin);
            return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return this.userLastLogin;
        }
    }
}
