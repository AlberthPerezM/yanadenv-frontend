import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { login, loginError, loginSuccess } from './auth.actions';
import { AuthService } from '../../core/service/auth.service';

@Injectable()
export class AuthEffects {
  // Inyecta las dependencias aquí para asegurar que estén disponibles inmediatamente
  private actions$ = inject(Actions);
  private service = inject(AuthService);
  private router = inject(Router);
  // En AuthEffects
  login$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    exhaustMap(action => this.service.loginUser({
      username: action.username,
      password: action.password
    }).pipe(
      map(response => {
        const token = response.token;
        const payload = this.service.getPayload(token);
        this.service.token = token; // Asegurar que el token se guarde
        return loginSuccess({
          login: {
            user: { username: payload.sub },
            isAuth: true,
            isAdmin: payload.isAdmin,
            token: token
          }
        });
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Error de autenticación';
        return of(loginError({ error: errorMessage }));
      })
    ))
  ));

  loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    tap(() => {
      // Muestra un mensaje de bienvenida y redirige
      Swal.fire({
        icon: 'success',
        title: 'Login Exitoso',
        text: '¡Bienvenido de vuelta!',
        timer: 1500,
        showConfirmButton: false
      });
      this.router.navigate(['/dashboard']);
    })
  ), { dispatch: false });

  loginError$ = createEffect(() => this.actions$.pipe(
    ofType(loginError),
    tap(action => Swal.fire('Error en el Login', action.error, 'error'))
  ), { dispatch: false });

  // El constructor ya no es necesario para la inyección de dependencias
  constructor() { }
}