import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND_URL } from '../../config/config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CentroService {
  private urlEndPoint: string = BACKEND_URL + '/api/centros';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  //Metodo para contar participante
  countCentros(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/count`);
  }
}
