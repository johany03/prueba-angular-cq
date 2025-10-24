import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule, ToastModule, NgIf],
    templateUrl: './login.component.html',
    providers: [AuthService, MessageService]
})
export class LoginComponent implements OnInit {
    form!: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    login() {
        this.auth.login(this.form.value.email, this.form.value.password).subscribe({
            next: (res: any) => {
                this.router.navigate(['/dashboard']);
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Inicio sesión exitoso' });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.errors[0] });
            }
        });
    }

    get email() {
        return this.form.get('email')!;
    }

    get password() {
        return this.form.get('password')!;
    }
}
