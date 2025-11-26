import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ParqueaderoService } from '../../services/parqueadero.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ListaParqueadero, Tarifa } from '../../model/cliente.model';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, TextareaModule, ToastModule, ToggleSwitchModule, Select, DatePickerModule],
    providers: [MessageService]
})
export class FormComponent implements OnInit {
    @Output() clienteSaved = new EventEmitter<void>();

    parqueaderoDialog: boolean = false;
    parqueaderoForm!: FormGroup;
    submitted: boolean = false;
    isEditing: boolean = false;
    loading: boolean = false;
    tarifas: Tarifa[] = [];
    id: null | number = null;
    currentDate: Date = new Date();
    valorTarifa: number = 0;

    constructor(
        private fb: FormBuilder,
        private parqueaderoService: ParqueaderoService,
        private messageService: MessageService
    ) {}

    buildForm() {
        this.parqueaderoForm = this.fb.group({
            placa: ['', [Validators.required]],
            tipo_vehiculo_id: [null, Validators.required],
            hora_entrada: ['', Validators.required],
            hora_salida: [''],
            valor_pagado: [''],
            estado: ['Pendiente']
        });
    }

    ngOnInit() {
        this.buildForm();
        this.listTarifas();
    }

    listTarifas() {
        this.parqueaderoService.listTarifas().subscribe({
            next: (tarifas) => {
                this.tarifas = tarifas;
            },
            error: (err) => {
                this.handleApiError(err);
            }
        });
    }

    hideDialog() {
        this.parqueaderoDialog = false;
        this.submitted = false;
        this.loading = false;
        this.parqueaderoForm.reset({ enabled: true });
    }

    openNew() {
        this.isEditing = false;
        this.submitted = false;
        this.parqueaderoForm.reset({ enabled: true });
        this.parqueaderoDialog = true;
    }

    editParqueadero(parqueadero: ListaParqueadero) {
        this.isEditing = true;
        this.submitted = false;
        this.loading = true;
        this.parqueaderoDialog = true;

        // Cargar los datos completos del parqueadero desde la API
        this.parqueaderoService.getParquederoById(parqueadero.id).subscribe({
            next: (parqueaderoCompleto) => {
                const data = parqueaderoCompleto.data;
                this.id = data.id;
                this.parqueaderoForm.patchValue({
                    id: data.id,
                    placa: data.placa,
                    tipo_vehiculo_id: data.tipo_vehiculo_id,
                    hora_entrada: data.hora_entrada,
                    hora_salida: data.hora_salida,
                    valor_pagado: data.valor_pagado
                });
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.handleApiError(err);
                this.hideDialog();
            }
        });
    }

    saveParquedero() {
        this.submitted = true;

        if (this.parqueaderoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, complete todos los campos requeridos correctamente',
                life: 3000
            });
            return;
        }
        const horaEntrada = this.formatDateWithMillis(this.parqueaderoForm.value.hora_entrada);
        const horaSalida = this.formatDateWithMillis(this.parqueaderoForm.value.hora_salida);
        const parqueadero: ListaParqueadero = {
            id: this.id as number,
            placa: this.parqueaderoForm.value.placa,
            tipo_vehiculo_id: this.parqueaderoForm.value.tipo_vehiculo_id,
            hora_entrada: horaEntrada,
            hora_salida: horaSalida,
            valor_pagado: this.parqueaderoForm.value.valor_pagado,
            estado: 'Pendiente'
        };

        if (this.isEditing) {
            const tarifa = this.tarifas.find((t) => t.id === parqueadero.tipo_vehiculo_id);
            const valorHoraData = tarifa?.valor_hora || 0;
            const valorHoraTarifa = Math.trunc(valorHoraData);

            if (parqueadero.hora_salida && parqueadero.hora_entrada) {
                const entrada = new Date(parqueadero.hora_entrada).getTime();
                const salida = new Date(parqueadero.hora_salida).getTime();
                const diffMs = salida - entrada;
                const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Convertir ms a horas y redondear hacia arriba
                this.valorTarifa = diffHours * valorHoraTarifa;
                parqueadero.valor_pagado = this.valorTarifa;
                parqueadero.estado = 'Pagado';
            }

            // Actualizar parqueadero existente
            this.parqueaderoService.updateParqueadero(parqueadero.id, parqueadero).subscribe({
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
            this.parqueaderoService.createParquedero(parqueadero).subscribe({
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

    private formatDateWithMillis(value: Date | string | null): string | null {
        if (!value) return null;
        const date = value instanceof Date ? value : new Date(String(value).replace(' ', 'T'));
        const pad2 = (n: number) => n.toString().padStart(2, '0');
        const pad3 = (n: number) => n.toString().padStart(3, '0');
        const Y = date.getFullYear();
        const M = pad2(date.getMonth() + 1);
        const D = pad2(date.getDate());
        const h = pad2(date.getHours());
        const m = pad2(date.getMinutes());
        const s = pad2(date.getSeconds());
        return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    }
}
