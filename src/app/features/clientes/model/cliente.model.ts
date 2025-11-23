export interface Cliente {
    id?: number;
    tax_id: string;
    name: string;
    address: string;
    contact_email: string;
    enabled?: boolean;
}

export interface ClienteList {
    id?: number;
    name: string;
    contact_email: string;
    enabled?: boolean;
}

export interface ListaParqueadero {
    id: number;
    placa: string;
    tipo_vehiculo_id: number;
    hora_entrada: string;
    hora_salida: null;
    valor_pagado: null;
    estado: string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
}
