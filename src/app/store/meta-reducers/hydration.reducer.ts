// src/app/store/meta-reducers/hydration.reducer.ts

import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

export function hydrationMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const savedAuth = sessionStorage.getItem('login');
      if (savedAuth) {
        try {
          const authState = JSON.parse(savedAuth);
          return reducer({ ...state, auth: authState }, action);
        } catch {
          return reducer(state, action);
        }
      }
    }
    return reducer(state, action);
  };
}
