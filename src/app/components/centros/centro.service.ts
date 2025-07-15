import { Injectable } from '@angular/core';
import { map, Observable, of,catchError, throwError } from 'rxjs';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Centro } from './centro';
import { Nivel } from './nivel';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CentroService {
  //private urlEndPoint: string = 'http://localhost:8080/api/centros';
  private urlEndPoint: string = BACKEND_URL + '/api/centros';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient ,  private router: Router) { }
   
  //Listar niveles
  getNiveles(): Observable<Nivel[]> {
      return this.http.get<Nivel[]>(this.urlEndPoint + '/niveles');
    }
  
  //Metodo para listar datos
  getCentros(): Observable<Centro[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Centro[])
    );
  }

  //Metodo para crear
  create(centro: Centro): Observable<any> {
    return this.http.post<Centro>(this.urlEndPoint, centro, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire( e.error.mensaje,e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //Cargar datos para actualizar
  getCentro(id: number): Observable<Centro> {
    return this.http.get<Centro>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/centros']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //Actualizar datos
  update(centro: Centro): Observable<any>
  {return this.http.put<any>
    (`${this.urlEndPoint}/${centro.idCen}`,centro,{ headers: this.httpHeaders });
  }
  //Eliminar dato
  delete(id: number): Observable<Centro> {
    return this.http.delete<Centro>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
         return throwError(e);

      })
    );
  }


}
