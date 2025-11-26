import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetByIdParqueadero, ListaParqueadero, Tarifa } from '../model/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ParqueaderoService {
    private http = inject(HttpClient);
    private urlApi = environment.BASE_URL + '/parqueadero';
    private urlApiTarifas = environment.BASE_URL + '/tarifa';

    /**
     * Obtiene el listado de todos los clientes
     * @returns Observable<ClienteList[]>
     */
    getClientes(): Observable<ListaParqueadero[]> {
        return this.http.post<ListaParqueadero[]>(`${this.urlApi}/list/`, {});
    }

    /**
     * Obtiene un cliente por su ID
     * @param id ID del cliente
     * @returns Observable<Cliente>
     */
    getParquederoById(id: number): Observable<GetByIdParqueadero> {
        return this.http.post<GetByIdParqueadero>(`${this.urlApi}/placa/${id}`, {});
    }

    /**
     * Crea un nuevo parquedero
     * @param parquedero Datos del parquedero a crear
     * @returns Observable<ListaParqueadero>
     */
    createParquedero(parquedero: ListaParqueadero): Observable<ListaParqueadero> {
        return this.http.post<ListaParqueadero>(`${this.urlApi}/create`, parquedero);
    }

    /**
     * Actualiza un parquedero existente
     * @param id ID del parquedero
     * @param parquedero Datos actualizados del parquedero
     * @returns Observable<ListaParqueadero>
     */
    updateParqueadero(id: number, parquedero: ListaParqueadero): Observable<ListaParqueadero> {
        console.log('Actualizar parquedero ID:', id, parquedero);
        return this.http.put<ListaParqueadero>(`${this.urlApi}/placa/${id}`, parquedero);
    }

    /**
     * Elimina un parquedero
     * @param id ID del parquedero a eliminar
     * @returns Observable<void>
     */
    deleteCliente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.urlApi}/placa/${id}`);
    }

    listTarifas(): Observable<Tarifa[]> {
        return this.http.post<Tarifa[]>(`${this.urlApiTarifas}/list`, {});
    }
}
