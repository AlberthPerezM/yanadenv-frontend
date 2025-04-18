import { Injectable } from '@angular/core';
import { map, Observable, of, catchError, throwError, tap, finalize } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExamenLaboratorio } from './examen-laboratorio';
import { ParticipanteService } from '../participante/participante.service';

@Injectable({
  providedIn: 'root'
})
export class ExamenLaboratorioService {
  private urlEndPoint: string = 'http://localhost:8080/api/examenes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  // Variable para seguimiento de operaciones en progreso
  private operationInProgress: boolean = false;

  constructor(
    private http: HttpClient,
    private participanteService: ParticipanteService,
    private router: Router
  ) { }

  /**
   * Método optimizado para agregar exámenes a un participante existente
   * Este método es el recomendado para resolver el problema de idExa undefined
   */
  addExamenesToParticipante(idParticipante: number, examenes: ExamenLaboratorio[]): Observable<any> {
    const url = `${this.urlEndPoint}/participante/${idParticipante}/examenes`;
    return this.http.post<any>(url, examenes).pipe(
      tap(response => {
        // Actualizar IDs generados
        response.examenesLaboratorio.forEach((examenRespuesta: ExamenLaboratorio, index: number) => {
          examenes[index].idExa = examenRespuesta.idExa;
        });
      })
    );
  }
  
  /**
   * Obtener todos los exámenes
   */
  getExamenes(): Observable<ExamenLaboratorio[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as ExamenLaboratorio[]),
      catchError(e => {
        console.error('Error al obtener exámenes:', e);
        return throwError(() => e);
      })
    );
  }
  
  /**
   * Método para crear un examen sin asociarlo a un participante
   * NOTA: No recomendado para relaciones ManyToMany, usar create() en su lugar
   */
  createExamen(examen: ExamenLaboratorio): Observable<ExamenLaboratorio> {
    console.log('Creando examen sin asociar:', examen);
    return this.http.post<ExamenLaboratorio>(this.urlEndPoint, examen, {
      headers: this.httpHeaders,
    }).pipe(
      tap(response => {
        console.log('Examen creado:', response);
      }),
      catchError(e => {
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
      tap(response => {
        // El backend debe devolver el examen con su ID generado
        console.log('Respuesta de creación:', response);
        
        // Actualizamos el objeto local con el ID generado por el servidor
        if (response && response.idExa) {
          examen.idExa = response.idExa;
        }
      }),
      catchError(e => {
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
  
  /**
   * Método para guardar múltiples exámenes y asociarlos a un participante en una sola operación
   * NUEVO: Este método simplifica la creación de múltiples exámenes
   */
 /* saveExamenes(examenes: ExamenLaboratorio[], idParticipante: number): Observable<any> {
    if (!examenes || examenes.length === 0) {
      return of({ message: 'No hay exámenes para guardar' });
    }
    
    const url = `${this.urlEndPoint}/participante/${idParticipante}/multiple`;
    
    console.log('Guardando múltiples exámenes:', examenes);
    console.log('Para el participante ID:', idParticipante);
    
    return this.http.post<any>(url, examenes, { headers: this.httpHeaders }).pipe(
      tap(response => {
        console.log('Respuesta del servidor (múltiples):', response);
      }),
      catchError(e => {
        console.error('Error al guardar múltiples exámenes:', e);
        Swal.fire('Error', 'No se pudieron guardar los exámenes', 'error');
        return throwError(() => e);
      })
    );
  }*/
    saveExamenes(examenes: ExamenLaboratorio[], idParticipante: number): Observable<any> {
      const url = `http://localhost:8080/api/participantes/${idParticipante}/examenes`;
      return this.http.post<any>(url, examenes, { 
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          }) 
      }).pipe(
          catchError(e => {
              console.error('Error detallado:', e);
              return throwError(() => e);
          })
      );
  }
  
  /**
   * Obtener un examen por ID
   */
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

  /**
   * Actualizar un examen existente
   */
  update(examen: ExamenLaboratorio): Observable<any> {
    // Verificamos que el examen tenga un ID asignado
    if (!examen.idExa) {
      console.error('No se puede actualizar un examen sin ID');
      return throwError(() => new Error('El examen no tiene un ID asignado'));
    }
    
    console.log('Actualizando examen:', examen);
    return this.http.put<any>(`${this.urlEndPoint}/${examen.idExa}`, examen, { headers: this.httpHeaders }).pipe(
      tap(response => {
        console.log('Examen actualizado:', response);
      }),
      catchError(e => {
        console.error('Error al actualizar el examen:', e);
        Swal.fire('Error', 'No se pudo actualizar el examen', 'error');
        return throwError(() => e);
      })
    );
  }

  /**
   * Eliminar un examen por ID
   */
  delete(id: number): Observable<ExamenLaboratorio> {
    return this.http.delete<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
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
