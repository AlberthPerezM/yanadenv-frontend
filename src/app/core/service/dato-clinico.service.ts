import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatoClinico } from '../models/dato-clinico';
import { BACKEND_URL } from '../../config/config'; // O puedes usar environment.backendUrl

@Injectable({
  providedIn: 'root',
})
export class DatoClinicoService {

  private urlEndPoint: string = `${BACKEND_URL}/api/datosclinicos`;

  constructor(private http: HttpClient, private router: Router) { }

  private getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Listar todos los datos clínicos
  getDatosClinicos(): Observable<DatoClinico[]> {
    return this.http
      .get<DatoClinico[]>(this.urlEndPoint)
      .pipe(
        catchError((e) => {
          console.error('Error al obtener datos clínicos:', e);
          Swal.fire('Error', 'No se pudieron cargar los datos clínicos', 'error');
          return throwError(() => e);
        })
      );
  }

  // Crear un DatoClinico asociado a un participante

  create(idPar: number, dato: DatoClinico): Observable<DatoClinico> {
    return this.http.post<DatoClinico>(`${this.urlEndPoint}/participante/${idPar}`, dato).pipe(
      catchError((e) => {
        console.error('Error al crear dato clínico:', e);
        const mensaje = e.error?.mensaje || 'No se pudo crear el dato clínico';
        Swal.fire('Error', mensaje, 'error');
        return throwError(() => e);
      })
    );
  }


  // Obtener dato clínico por ID
  getDatoClinico(id: number): Observable<DatoClinico> {
    return this.http.get<DatoClinico>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/datosclinicos']);
        const mensaje = e.error?.mensaje || 'Dato clínico no encontrado';
        console.error(mensaje);
        Swal.fire('Error', mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  // Actualizar dato clínico existente
  update(datoClinico: DatoClinico): Observable<any> {
    if (!datoClinico.idDat) {
      return throwError(() => new Error('ID de dato clínico no definido para actualización'));
    }

    return this.http.put<any>(`${this.urlEndPoint}/${datoClinico.idDat}`,
      datoClinico,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError((e) => {
        console.error('Error al actualizar dato clínico:', e);
        const mensaje = e.error?.mensaje || 'No se pudo actualizar el dato clínico';
        Swal.fire('Error', mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  // Eliminar un dato clínico
  delete(id: number): Observable<DatoClinico> {
    return this.http
      .delete<DatoClinico>(`${this.urlEndPoint}/${id}`, {
        headers: this.getJsonHeaders()
      })
      .pipe(
        catchError((e) => {
          const mensaje = e.error?.mensaje || 'No se pudo eliminar el dato clínico';
          console.error(mensaje);
          Swal.fire('Error', mensaje, 'error');
          return throwError(() => e);
        })
      );
  }
  // Obtener el dato clínico por ID del participante
  getByParticipanteId(idPar: number): Observable<DatoClinico> {
    return this.http.get<DatoClinico>(`${this.urlEndPoint}/participante/${idPar}`);
  }
  // Contador de datos clínicos
  countDatosClinicos(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/count`).pipe(
      catchError((e) => {
        console.error('Error al contar datos clínicos:', e);
        Swal.fire('Error', 'No se pudo obtener el total de datos clínicos', 'error');
        return throwError(() => e);
      })
    );
  }
}
