
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { UsersEffects } from './store/users/users.effects';
import { usersReducer } from './store/users/users.reducer';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { tokenInterceptor } from './core/interceptor/token.interceptor';
import { hydrationMetaReducer } from './store/meta-reducers/hydration.reducer';

import { MetaReducer } from '@ngrx/store';

const metaReducers: MetaReducer[] = [hydrationMetaReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore(
      { users: usersReducer, auth: authReducer },
      { metaReducers }
    ),
    provideEffects(UsersEffects, AuthEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};


