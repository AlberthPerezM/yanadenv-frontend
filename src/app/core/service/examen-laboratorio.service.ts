import { Injectable } from '@angular/core';
import {
  map,
  Observable,
  of,
  catchError,
  throwError,
  tap,
  finalize,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExamenLaboratorio } from '../models/examen-laboratorio';
import { ParticipanteService } from './participante.service';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class ExamenLaboratorioService {
  //private urlEndPoint: string = 'http://localhost:8080/api/examenes';
  private urlEndPoint: string = BACKEND_URL + '/api/examenes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    private participanteService: ParticipanteService,
    private router: Router
  ) {}

  /** Obtener todos los exámenes*/
  getExamenes(): Observable<ExamenLaboratorio[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map((response) => response as ExamenLaboratorio[]),
      catchError((e) => {
        console.error('Error al obtener exámenes:', e);
        return throwError(() => e);
      })
    );
  }

  createExamen(examen: ExamenLaboratorio): Observable<ExamenLaboratorio> {
    console.log('Creando examen sin asociar:', examen);
    return this.http
      .post<ExamenLaboratorio>(this.urlEndPoint, examen, {
        headers: this.httpHeaders,
      })
      .pipe(
        tap((response) => {
          console.log('Examen creado:', response);
        }),
        catchError((e) => {
          console.error('Error al crear examen:', e);
          Swal.fire('Error', 'No se pudo crear el examen', 'error');
          return throwError(() => e);
        })
      );
  }

  /**
   * MÉTODO RECOMENDADO: Crea un examen y lo asocia directamente a un participante
   * Este método resuelve el problema del idExa undefined
   */
  create(examen: ExamenLaboratorio, idParticipante: number): Observable<any> {
    // Aseguramos que la URL coincida con el endpoint en el backend
    const url = `${this.urlEndPoint}/participante/${idParticipante}`;

    console.log('Creando y asociando examen:', examen);
    console.log('Para el participante ID:', idParticipante);

    return this.http.post<any>(url, examen, { headers: this.httpHeaders }).pipe(
      tap((response) => {
        // El backend debe devolver el examen con su ID generado
        console.log('Respuesta de creación:', response);

        // Actualizamos el objeto local con el ID generado por el servidor
        if (response && response.idExa) {
          examen.idExa = response.idExa;
        }
      }),
      catchError((e) => {
        console.error('Error detallado:', e);
        let errorMsg = 'Error al crear el examen';
        if (e.error && e.error.mensaje) {
          errorMsg = e.error.mensaje;
        }
        Swal.fire('Error', errorMsg, 'error');
        return throwError(() => e);
      })
    );
  }

  saveExamenes(
    examenes: ExamenLaboratorio[],
    idParticipante: number
  ): Observable<any> {
    const url = `http://localhost:8080/api/participantes/${idParticipante}/examenes`;
    return this.http
      .post<any>(url, examenes, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((e) => {
          console.error('Error detallado:', e);
          return throwError(() => e);
        })
      );
  }

  getExamen(id: number): Observable<ExamenLaboratorio> {
    return this.http.get<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.error('Error al obtener el examen:', e);
        let errorMsg = 'Error al obtener el examen';
        if (e.error && e.error.mensaje) {
          errorMsg = e.error.mensaje;
        }
        Swal.fire('Error', errorMsg, 'error');
        return throwError(() => e);
      })
    );
  }

  update(examen: ExamenLaboratorio): Observable<any> {
    // Verificamos que el examen tenga un ID asignado
    if (!examen.idExa) {
      console.error('No se puede actualizar un examen sin ID');
      return throwError(() => new Error('El examen no tiene un ID asignado'));
    }

    console.log('Actualizando examen:', examen);
    return this.http
      .put<any>(`${this.urlEndPoint}/${examen.idExa}`, examen, {
        headers: this.httpHeaders,
      })
      .pipe(
        tap((response) => {
          console.log('Examen actualizado:', response);
        }),
        catchError((e) => {
          console.error('Error al actualizar el examen:', e);
          Swal.fire('Error', 'No se pudo actualizar el examen', 'error');
          return throwError(() => e);
        })
      );
  }

  /** Eliminar un examen específico de un participante */
  deleteExamenFromParticipante(
    participanteId: number,
    examenId: number
  ): Observable<any> {
    const url = `${BACKEND_URL}/api/participantes/${participanteId}/examenes/${examenId}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders }).pipe(
      tap(() => {
        Swal.fire(
          'Éxito',
          'Examen eliminado correctamente del participante',
          'success'
        );
      }),
      catchError((e) => {
        console.error('Error al eliminar examen del participante:', e);
        let errorMsg = 'Error al eliminar el examen del participante';
        if (e.error && e.error.mensaje) {
          errorMsg = e.error.mensaje;
        }
        Swal.fire('Error', errorMsg, 'error');
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<ExamenLaboratorio> {
    return this.http
      .delete<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error('Error al eliminar el examen:', e);
          let errorMsg = 'Error al eliminar el examen';
          if (e.error && e.error.mensaje) {
            errorMsg = e.error.mensaje;
          }
          Swal.fire('Error', errorMsg, 'error');
          return throwError(() => e);
        })
      );
  }
}
