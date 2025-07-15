import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  console.log('➡️ Interceptando:', req.method, req.url);
  console.log('🔐 Token:', token);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    // 🧪 Verifica si el header se configuró
    console.log('📦 Headers:', authReq.headers.get('Authorization'));

    return next(authReq);
  }

  return next(req);
};
