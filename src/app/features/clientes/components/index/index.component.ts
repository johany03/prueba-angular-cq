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
import { Cliente, ClienteList } from '../../model/cliente.model';
import { ClienteService } from '../../services/cliente.service';
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
    providers: [MessageService, ClienteService, ConfirmationService]
})
export class IndexComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    @ViewChild(FormComponent) formComponent!: FormComponent;
    clientes!: ClienteList[];
    cols!: Column[];

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadColumns();
        this.getClientes();
    }

    // Logica para obtener los clientes y mostrarlos en una tabla
    getClientes() {
        this.clienteService.getClientes().subscribe((data) => {
            this.clientes = data;
        });
    }

    loadColumns() {
        this.cols = [
            { field: 'name', header: 'Nombre', sortable: true, width: '20rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'contact_email', header: 'Contacto Email', width: '20rem', type: 'expand', nameClass: 'text-center-column' },
            { field: 'enabled', header: 'Estado', width: '10rem', type: 'expand', nameClass: 'text-center-column' }
        ];
    }

    openNew() {
        this.formComponent.openNew();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editProduct(cliente: Cliente) {
        this.formComponent.editCliente(cliente);
    }

    deleteProduct(cliente: Cliente) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea eliminar este cliente?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.clienteService.deleteCliente(cliente.id!).subscribe({
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
