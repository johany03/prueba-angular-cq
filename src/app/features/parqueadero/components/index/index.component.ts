import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ListaParqueadero } from '../../model/cliente.model';
import { ParqueaderoService } from '../../services/parqueadero.service';
import { Column } from '@/shared/models/column.model';
import { FormComponent } from '../form/form.component';

@Component({
    standalone: true,
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TooltipModule,
        FormComponent
    ],
    providers: [MessageService, ParqueaderoService, ConfirmationService]
})
export class IndexComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    @ViewChild(FormComponent) formComponent!: FormComponent;
    parqueadero!: ListaParqueadero[];
    cols!: Column[];

    constructor(
        private parqueaderoService: ParqueaderoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadColumns();
        this.getClientes();
    }

    // Logica para obtener los clientes y mostrarlos en una tabla
    getClientes() {
        this.parqueaderoService.getClientes().subscribe((data) => {
            this.parqueadero = data;
        });
    }

    loadColumns() {
        this.cols = [
            { field: 'placa', header: 'Placa', sortable: true, width: '5rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'tipo_vehiculo_id', header: 'Tipo vehiculo', width: '5rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'hora_entrada', header: 'Hora Ingreso', width: '10rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'hora_salida', header: 'Hora Salida', width: '10rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'valor_pagado', header: 'Valor a Pagar', width: '5rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'estado', header: 'Estado', width: '5rem', type: 'expand', nameClass: 'text-center-column' }
        ];
    }

    openNew() {
        this.formComponent.openNew();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editProduct(parqueadero: ListaParqueadero) {
        this.formComponent.editParqueadero(parqueadero);
    }

    deleteProduct(parqueadero: ListaParqueadero) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar este cliente?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.parqueaderoService.deleteCliente(parqueadero.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Cliente eliminado correctamente',
                            life: 3000
                        });
                        this.getClientes(); // Recargar la lista
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al eliminar el cliente',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    onClienteSaved() {
        this.getClientes(); // Recargar la lista cuando se guarda un cliente
    }
}
