import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Campania } from '../models/campania';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CampaniaService {

  private urlEndPoint: string = BACKEND_URL + '/api/campanias';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  // Obtener todas las campañas
  getAll(): Observable<Campania[]> {
    return this.http.get<Campania[]>(this.urlEndPoint);
  }
  // Listar campañas


  // Obtener campaña por ID
  getById(id: number): Observable<Campania> {
    return this.http.get<Campania>(`${this.urlEndPoint}/${id}`);
  }

  // Crear campaña
  create(campania: Campania): Observable<Campania> {
    return this.http.post<Campania>(this.urlEndPoint, campania, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al crear campaña', e.error?.mensaje || 'Error desconocido', 'error');
        return throwError(() => e);
      })
    );
  }

  // Actualizar campaña
  update(id: number, campania: Campania): Observable<Campania> {
    return this.http.put<Campania>(`${this.urlEndPoint}/${id}`, campania, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al actualizar campaña', e.error?.mensaje || 'Error desconocido', 'error');
        return throwError(() => e);
      })
    );
  }

  // Eliminar campaña
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar campaña', e.error?.mensaje || 'Error desconocido', 'error');
        return throwError(() => e);
      })
    );
  }

  // Obtener campañas por centro
  getByCentro(idCentro: number): Observable<Campania[]> {
    return this.http.get<Campania[]>(`${BACKEND_URL}/api/centros/${idCentro}/campanias`);
  }

  // Contar campañas
  count(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/count`);
  }
}
