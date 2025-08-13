import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Participante } from '../models/participante';
import { BACKEND_URL } from '../../config/config';
import { Campania } from '../models/campania';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {

  private urlEndPoint: string = `${BACKEND_URL}/api/participantes`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }
  // Listar campañas
  getCampanias(): Observable<Campania[]> {
    return this.http.get(this.urlEndPoint + '/campanias').pipe(
      map(response => response as Campania[])
    );
  }

  /** Obtener todos los participantes */
  getParticipantes(): Observable<Participante[]> {
    return this.http.get<Participante[]>(this.urlEndPoint);
  }

  /** Obtener un participante por su ID */
  getParticipante(id: number): Observable<Participante> {
    return this.http.get<Participante>(`${this.urlEndPoint}/${id}`);
  }

  /** Crear un nuevo participante */
  create(participante: Participante): Observable<Participante> {
    return this.http.post<Participante>(this.urlEndPoint, participante, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  /** Actualizar un participante existente */
  update(participante: Participante): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${participante.idPar}`, participante, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  /** Eliminar un participante por ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  /** Obtener el total de participantes */
  countParticipantes(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/count`);
  }

  /** Manejo centralizado de errores */
  private handleError(error: any): Observable<never> {
    console.error(error.error?.mensaje || 'Error desconocido');
    Swal.fire(
      error.error?.mensaje || 'Error en la operación',
      error.error?.error || 'Ocurrió un error inesperado',
      'error'
    );
    return throwError(() => error);
  }
}
