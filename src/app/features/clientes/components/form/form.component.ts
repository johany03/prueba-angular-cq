import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../../services/cliente.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, InputTextModule, ToastModule, ToggleSwitchModule],
    providers: [MessageService]
})
export class FormComponent implements OnInit {
    clienteDialog: boolean = false;
    clienteForm: FormGroup;
    submitted: boolean = false;
    isEditing: boolean = false;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService
    ) {
        this.clienteForm = this.fb.group({
            id: [null],
            tax_id: ['', [Validators.required, Validators.maxLength(12)]],
            name: ['', [Validators.required, Validators.maxLength(100)]],
            address: ['', Validators.required],
            contact_email: ['', [Validators.required, Validators.email]],
            enabled: [true]
        });
    }

    ngOnInit() {}

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
        this.clienteForm.reset();
    }

    openNew() {
        this.isEditing = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.clienteForm.reset({
            enabled: true
        });
    }

    editCliente(cliente: any) {
        this.isEditing = true;
        this.clienteDialog = true;
        this.clienteForm.patchValue(cliente);
    }

    saveCliente() {
        this.submitted = true;

        if (this.clienteForm.invalid) {
            return;
        }

        const cliente = this.clienteForm.value;

        if (this.isEditing) {
            // Actualizar cliente existente
            this.clienteService.updateCliente(cliente.id, cliente).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Cliente actualizado correctamente',
                        life: 3000
                    });
                    this.hideDialog();
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar el cliente',
                        life: 3000
                    });
                }
            });
        } else {
            // Crear nuevo cliente
            this.clienteService.createCliente(cliente).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Cliente creado correctamente',
                        life: 3000
                    });
                    this.hideDialog();
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear el cliente',
                        life: 3000
                    });
                }
            });
        }
    }
}
