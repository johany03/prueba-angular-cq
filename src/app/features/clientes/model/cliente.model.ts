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
