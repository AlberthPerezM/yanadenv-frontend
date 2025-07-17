import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { BACKEND_URL } from '../../config/config';
import { logout } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = BACKEND_URL + '/login';
  private _user: any;

constructor(
  private store: Store<{ auth: any }>,
  private http: HttpClient
) {
  // Escucha los cambios del store y guarda en _user
  this.store.select('auth').subscribe(state => {
    this._user = state;

    // 🧠 Guarda el estado en sessionStorage automáticamente
    sessionStorage.setItem('login', JSON.stringify(state));
  });
}

  // 🔐 Enviar login al backend

  loginUser({ username, password }: any): Observable<any> {
  return this.http.post<any>(this.url, { username, password }).pipe(
    tap(response => {
      this.token = response.token; // Almacenar el token inmediatamente
    })
  );
}

  // 📦 Setters y Getters de sesión
  set user(user: any) {
    sessionStorage.setItem('login', JSON.stringify(user));
  }

  get user() {
    // Primero intenta desde el store (_user)
    if (this._user && this._user.isAuth !== undefined) {
      return this._user;
    }

    // Si no, intenta desde sessionStorage
    const session = sessionStorage.getItem('login');
    if (session) {
      return JSON.parse(session);
    }

    return null;
  }

  set token(token: string) {
    sessionStorage.setItem('token', token);
  }

  get token() {
    return sessionStorage.getItem('token')!;
  }

  // 🧠 Decodifica el token
  getPayload(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  authenticated(): boolean {
    return this.user?.isAuth ?? false;
  }

  // 🔑 Verifica si el usuario es admin
  isAdmin(): boolean {
    return this.user?.isAdmin ?? false;
  }
 
  // 🚪 Cierra sesión
  logout() {
    this.store.dispatch(logout());
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }
}
