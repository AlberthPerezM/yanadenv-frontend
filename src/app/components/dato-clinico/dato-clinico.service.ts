import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatoClinico } from './dato-cliente';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class DatoClinicoService {

  //private urlEndPoint: string = 'http://localhost:8080/api/datosclinicos';
  
  private urlEndPoint: string = BACKEND_URL + '/api/datosclinicos';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  // Listar todos los datos clínicos
  getDatosClinicos(): Observable<DatoClinico[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as DatoClinico[])
    );
  }

  // Crear nuevo dato clínico
  create(datoClinico: DatoClinico): Observable<any> {
    return this.http.post<DatoClinico>(this.urlEndPoint, datoClinico, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Obtener dato clínico por ID
  getDatoClinico(id: number): Observable<DatoClinico> {
    return this.http.get<DatoClinico>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/datosclinicos']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Actualizar dato clínico existente
  update(datoClinico: DatoClinico): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${datoClinico.idDat}`,
      datoClinico,
      { headers: this.httpHeaders }
    );
  }

  // Eliminar un dato clínico
  delete(id: number): Observable<DatoClinico> {
    return this.http.delete<DatoClinico>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
