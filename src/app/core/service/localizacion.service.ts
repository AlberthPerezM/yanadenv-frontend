import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


import { BACKEND_URL } from '../../config/config';
import { Region } from '../models/region';
import { Provincia } from '../models/provincia';
import { Distrito } from '../models/distrito';
import { Centro } from '../models/centro';
@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {

  private urlEndPoint = `${BACKEND_URL}/api`;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`).pipe(
      map(response => response as Region[]),
      catchError(e => {
        console.error('Error al cargar las regiones', e);
        Swal.fire('Error', 'No se pudieron cargar las regiones', 'error');
        return throwError(() => e);
      })
    );
  }

  getProvinciasPorRegion(idReg: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.urlEndPoint}/regiones/${idReg}/provincias`).pipe(
      map(response => response as Provincia[]),
      catchError(e => {
        console.error('Error al cargar las provincias', e);
        Swal.fire('Error', 'No se pudieron cargar las provincias', 'error');
        return throwError(() => e);
      })
    );
  }

  getDistritosPorProvincia(idProv: number): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.urlEndPoint}/provincias/${idProv}/distritos`).pipe(
      map(response => response as Distrito[]),
      catchError(e => {
        console.error('Error al cargar los distritos', e);
        Swal.fire('Error', 'No se pudieron cargar los distritos', 'error');
        return throwError(() => e);
      })
    );
  }
  getCentrosPorDistrito(idDist: number): Observable<Centro[]> {
    return this.http.get<Centro[]>(`${this.urlEndPoint}/distritos/${idDist}/centros`).pipe(
      map(response => response as Centro[]),
      catchError(e => {
        console.error('Error al cargar los centros', e);
        Swal.fire('Error', 'No se pudieron cargar los centros', 'error');
        return throwError(() => e);
      })
    );
  }

  getJerarquiaPorCentro(idCentro: number): Observable<{
    idRegion: number;
    idProvincia: number;
    idDistrito: number;
    idCentro: number;
  }> {
    return this.http.get<{
      idRegion: number;
      idProvincia: number;
      idDistrito: number;
      idCentro: number;
    }>(`${BACKEND_URL}/centros/${idCentro}/jerarquia`);
  }
}