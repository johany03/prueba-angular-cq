export interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
    width?: string;
    sortable?: boolean;
    nameClass?: string;
    type?: string;
    visible?: boolean;
}
