import { Injectable } from '@angular/core';
import { map, Observable, of, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Apoderado } from './apoderado';
import { Participante } from '../participante/participante';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {
  private urlEndPoint: string = 'http://localhost:8080/api/apoderados';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  // Listar participantes
  getParticipantes(): Observable<Participante[]> {
      return this.http.get<Participante[]>(this.urlEndPoint + '/participantes');
  }

  // Método para listar datos
  getApoderados(): Observable<Apoderado[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Apoderado[])
    );
  }

  // Método para crear
  create(apoderado: Apoderado): Observable<any> {
    return this.http.post<Apoderado>(this.urlEndPoint, apoderado, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Cargar datos para actualizar
  getApoderado(id: number): Observable<Apoderado> {
    return this.http.get<Apoderado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/apoderados']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Actualizar datos
  update(apoderado: Apoderado): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${apoderado.idApo}`, apoderado, { headers: this.httpHeaders }
    );
  }

  // Eliminar dato
  delete(id: number): Observable<Apoderado> {
    return this.http.delete<Apoderado>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
