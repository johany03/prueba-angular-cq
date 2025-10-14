import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../../services/cliente.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Cliente, ClienteList } from '../../model/cliente.model';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, TextareaModule, ToastModule, ToggleSwitchModule],
    providers: [MessageService]
})
export class FormComponent implements OnInit {
    @Output() clienteSaved = new EventEmitter<void>();
    
    clienteDialog: boolean = false;
    clienteForm: FormGroup;
    submitted: boolean = false;
    isEditing: boolean = false;
    loading: boolean = false;

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
        this.loading = false;
        this.clienteForm.reset({ enabled: true });
    }

    openNew() {
        this.isEditing = false;
        this.submitted = false;
        this.clienteForm.reset({ enabled: true });
        this.clienteDialog = true;
    }

    editCliente(cliente: ClienteList) {
        this.isEditing = true;
        this.submitted = false;
        this.loading = true;
        this.clienteDialog = true;
        
        // Cargar los datos completos del cliente desde la API
        this.clienteService.getClienteById(cliente.id!).subscribe({
            next: (clienteCompleto) => {
                this.clienteForm.patchValue(clienteCompleto);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.handleApiError(err);
                this.hideDialog();
            }
        });
    }

    saveCliente() {
        this.submitted = true;

        if (this.clienteForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, complete todos los campos requeridos correctamente',
                life: 3000
            });
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
                    this.clienteSaved.emit(); // Emitir evento para recargar lista
                },
                error: (err) => {
                    this.handleApiError(err);
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
                    this.clienteSaved.emit(); // Emitir evento para recargar lista
                },
                error: (err) => {
                    this.handleApiError(err);
                }
            });
        }
    }

    getDialogHeader(): string {
        return this.isEditing ? 'Editar Cliente' : 'Nuevo Cliente';
    }

    private handleApiError(err: any): void {
        const errorResponse = err?.error;
        
        if (errorResponse?.errors && Array.isArray(errorResponse.errors)) {
            // Mostrar cada error del array de errores
            errorResponse.errors.forEach((error: string) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de Validación',
                    detail: error,
                    life: 5000
                });
            });
        } else {
            // Error genérico si no hay errores específicos
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: errorResponse?.message || 'Error al procesar la solicitud',
                life: 3000
            });
        }
    }
}
