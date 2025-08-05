import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { ExamenLaboratorio } from '../models/examen-laboratorio';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class ExamenLaboratorioService {

  private urlEndPoint = `${BACKEND_URL}/api/examenes`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /** Obtener todos los exámenes */
  getExamenes(): Observable<ExamenLaboratorio[]> {
    return this.http.get<ExamenLaboratorio[]>(this.urlEndPoint)
      .pipe(catchError(this.handleError('obtener exámenes')));
  }

  /** Obtener un examen por su ID */
  getExamen(id: number): Observable<ExamenLaboratorio> {
    return this.http.get<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError(this.handleError('obtener el examen')));
  }

  /** Crear un examen sin asociarlo a un participante */
  createExamen(examen: ExamenLaboratorio): Observable<ExamenLaboratorio> {
    return this.http.post<ExamenLaboratorio>(this.urlEndPoint, examen, { headers: this.httpHeaders })
      .pipe(
        tap(response => console.log('Examen creado:', response)),
        catchError(this.handleError('crear examen'))
      );
  }

  /** Crear un examen y asociarlo a un participante */
  create(examen: ExamenLaboratorio, idParticipante: number): Observable<any> {
    const url = `${this.urlEndPoint}/participante/${idParticipante}`;
    return this.http.post<any>(url, examen, { headers: this.httpHeaders })
      .pipe(
        tap(response => {
          console.log('Examen asociado a participante:', response);
          if (response?.idExa) examen.idExa = response.idExa;
        }),
        catchError(this.handleError('asociar examen al participante'))
      );
  }

  /** Guardar múltiples exámenes asociados a un participante */
  saveExamenes(examenes: ExamenLaboratorio[], idParticipante: number): Observable<any> {
    const url = `${BACKEND_URL}/api/participantes/${idParticipante}/examenes`;
    return this.http.post<any>(url, examenes, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError('guardar exámenes del participante')));
  }

  /** Actualizar un examen */
  update(examen: ExamenLaboratorio): Observable<any> {
    if (!examen.idExa) {
      return throwError(() => new Error('El examen no tiene un ID asignado'));
    }

    return this.http.put<any>(`${this.urlEndPoint}/${examen.idExa}`, examen, { headers: this.httpHeaders })
      .pipe(
        tap(response => console.log('Examen actualizado:', response)),
        catchError(this.handleError('actualizar examen'))
      );
  }

  /** Eliminar un examen por ID */
  delete(id: number): Observable<ExamenLaboratorio> {
    return this.http.delete<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError('eliminar examen')));
  }

  /** Eliminar un examen específico de un participante */
  deleteExamenFromParticipante(participanteId: number, examenId: number): Observable<any> {
    const url = `${BACKEND_URL}/api/participantes/${participanteId}/examenes/${examenId}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders }).pipe(
      tap(() => Swal.fire('Éxito', 'Examen eliminado correctamente del participante', 'success')),
      catchError(this.handleError('eliminar examen del participante'))
    );
  }

  /** Manejo centralizado de errores */
  private handleError(accion: string) {
    return (error: any): Observable<never> => {
      console.error(`Error al ${accion}:`, error);
      const mensaje = error.error?.mensaje || `Error al ${accion}`;
      const detalle = error.error?.error || 'Ocurrió un error inesperado';
      Swal.fire('Error', mensaje, 'error');
      return throwError(() => error);
    };
  }

}
