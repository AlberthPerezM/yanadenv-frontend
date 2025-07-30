import { Injectable } from '@angular/core';
import { map, Observable, of, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Participante } from '../models/participante';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {

  //private urlEndPoint: string = 'http://localhost:8080/api/participantes';

  private urlEndPoint: string = BACKEND_URL + '/api/participantes';


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  // Listar participantes
  getParticipantes(): Observable<Participante[]> {
    return this.http.get<Participante[]>(this.urlEndPoint).pipe(
      map(response => response as Participante[])
    );
  }

  // Crear un participante
  create(participante: Participante): Observable<any> {
    return this.http.post<Participante>(this.urlEndPoint, participante, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Método para obtener un participante por ID
  getParticipante(id: number): Observable<Participante> {
    return this.http.get<Participante>(`${this.urlEndPoint}/${id}`);
  }


  // Actualizar un participante
  update(participante: Participante): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${participante.idPar}`, participante, { headers: this.httpHeaders });
  }

  //Metodo para contar participante
  countParticipantes(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/count`);
  }

  // Eliminar un participante
  delete(id: number): Observable<Participante> {
    return this.http.delete<Participante>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
