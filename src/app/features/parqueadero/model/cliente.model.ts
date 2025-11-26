export interface ListaParqueadero {
    id: number;
    placa: string;
    tipo_vehiculo_id: number;
    hora_entrada: string | null | Date;
    hora_salida: string | null | Date;
    valor_pagado: number | null;
    estado: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: null;
}

export interface Tarifa {
    id: number;
    tipo_vehiculo: string;
    valor_hora: number;
}

export interface GetByIdParqueadero {
    data: ListaParqueadero;
    message: string;
}
