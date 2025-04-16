import { Injectable } from '@angular/core';
import { map, Observable, of, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExamenLaboratorio } from './examen-laboratorio';

@Injectable({
  providedIn: 'root'
})
export class ExamenLaboratorioService {
  private urlEndPoint: string = 'http://localhost:8080/api/examenes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  // Método para listar todos los exámenes de laboratorio
  getExamenes(): Observable<ExamenLaboratorio[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as ExamenLaboratorio[])
    );
  }

  // Método para crear un nuevo examen
  create(examen: ExamenLaboratorio): Observable<any> {
    return this.http.post<ExamenLaboratorio>(this.urlEndPoint, examen, { headers: this.httpHeaders }).pipe(
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
      catchError(e => {
        this.router.navigate(['/examenes']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
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
