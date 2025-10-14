import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule],
    templateUrl: './login.component.html',
    providers: [AuthService]
})
export class LoginComponent implements OnInit {
    form!: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly router: Router
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
                localStorage.setItem('token', res.access_token);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error('Error en login:', err);
            }
        });
    }
}
