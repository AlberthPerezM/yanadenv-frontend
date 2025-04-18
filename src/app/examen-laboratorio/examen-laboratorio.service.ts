import { Injectable } from '@angular/core';
import { map, Observable, of, catchError, throwError } from 'rxjs';
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

  constructor(
    private http: HttpClient,
    private participanteService: ParticipanteService,
    private router: Router) { }
  // Asociar exámenes a un participante
addExamenesToParticipante(idParticipante: number, examenes: ExamenLaboratorio[]): Observable<any> {
  return this.http.post<any>(`${this.urlEndPoint}/participante/${idParticipante}/examenes`, examenes, { headers: this.httpHeaders }).pipe(
    catchError(e => {
      console.error(e.error.mensaje);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
  );
}
  // Método para listar todos los exámenes de laboratorio
  getExamenes(): Observable<ExamenLaboratorio[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as ExamenLaboratorio[])
    );
  }
  
  // Crear un nuevo examen
  createExamen(examen: ExamenLaboratorio): Observable<ExamenLaboratorio> {
    return this.http.post<ExamenLaboratorio>(this.urlEndPoint, examen, {
      headers: this.httpHeaders,
    });
  }
  // Método para crear un nuevo examen
  create(examen: ExamenLaboratorio, idParticipante: number): Observable<any> {
    return this.http.post<ExamenLaboratorio>(`${this.urlEndPoint}/participante/${idParticipante}`, examen, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // Cargar datos de un examen específico para su actualización
  getExamen(id: number): Observable<ExamenLaboratorio> {
    return this.http.get<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.error('Error al obtener el examen:', e.error.mensaje);
        Swal.fire('Error', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Actualizar datos de un examen
  update(examen: ExamenLaboratorio): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${examen.idExa}`, examen, { headers: this.httpHeaders });
  }

  // Eliminar un examen por ID
  delete(id: number): Observable<ExamenLaboratorio> {
    return this.http.delete<ExamenLaboratorio>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
 
  
}
