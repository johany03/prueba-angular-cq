import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente, ClienteList } from '../model/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private http = inject(HttpClient);
    private urlApi = environment.BASE_URL + '/customer';

    /**
     * Obtiene el listado de todos los clientes
     * @returns Observable<Cliente[]>
     */
    getClientes(): Observable<ClienteList[]> {
        return this.http.post<ClienteList[]>(`${this.urlApi}/list/`, {});
    }

    /**
     * Obtiene un cliente por su ID
     * @param id ID del cliente
     * @returns Observable<Cliente>
     */
    getClienteById(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.urlApi}/get/${id}`);
    }

    /**
     * Crea un nuevo cliente
     * @param cliente Datos del cliente a crear
     * @returns Observable<Cliente>
     */
    createCliente(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(`${this.urlApi}/create/`, cliente);
    }

    /**
     * Actualiza un cliente existente
     * @param id ID del cliente
     * @param cliente Datos actualizados del cliente
     * @returns Observable<Cliente>
     */
    updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.urlApi}/update/${id}`, cliente);
    }

    /**
     * Elimina un cliente
     * @param id ID del cliente a eliminar
     * @returns Observable<void>
     */
    deleteCliente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.urlApi}/delete/${id}`);
    }
}
