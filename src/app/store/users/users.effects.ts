import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { add, addSuccess, findAll, findAllPageable, load, remove, removeSuccess, setErrors, setPaginator, update, updateSuccess } from "./users.actions";
import { EMPTY, catchError, exhaustMap, map, of, tap } from "rxjs";
import { User } from "../../core/models/user";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { UserService } from "../../core/service/user.service";


@Injectable()
export class UsersEffects {

    // Inyecta las dependencias aquí en lugar de en el constructor
    private actions$ = inject(Actions);
    private service = inject(UserService);
    private router = inject(Router);

    loadUsers$ = createEffect(
        () => this.actions$.pipe(
            ofType(load),
            exhaustMap(action => this.service.findAllPageable(action.page)
                .pipe(
                    map(pageable => {
                        const users = pageable.content as User[];
                        const paginator = pageable;

                        // Despacha la acción con los datos cargados
                        return findAllPageable({ users, paginator });
                    }),
                    // Es una buena práctica manejar el error despachando una acción de fallo
                    catchError((error) => {
                        console.error(error);
                        // Considera crear una acción como `loadFailure` para manejar errores en el UI
                        return of(); // of() o EMPTY para no romper el stream de effects
                    })
                )
            )
        )
    );

    addUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(add),
            exhaustMap(action => this.service.create(action.userNew)
                .pipe(
                    map(userNew => addSuccess({ userNew })),
                    catchError(error => {
                        if (error.status == 400) {
                            // Despacha la acción de errores para que el reducer la maneje
                            return of(setErrors({ userForm: action.userNew, errors: error.error }));
                        }
                        console.error(error);
                        return of(); // Evita que el effect se rompa en otros errores
                    })
                )
            )
        )
    );

    updateUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(update),
            exhaustMap(action => this.service.update(action.userUpdated)
                .pipe(
                    map(userUpdated => updateSuccess({ userUpdated })),
                    catchError(error => {
                        if (error.status == 400) {
                            return of(setErrors({ userForm: action.userUpdated, errors: error.error }));
                        }
                        console.error(error);
                        return of();
                    })
                )
            )
        )
    );

    removeUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(remove),
            exhaustMap(action => this.service.remove(action.id)
                .pipe(
                    map(() => removeSuccess({ id: action.id })),
                    catchError((error) => {
                        console.error(error);
                        // Aquí también podrías despachar una acción de `removeFailure`
                        return of();
                    })
                )
            )
        )
    );

    // --- Effects que no despachan acciones (side-effects) ---

    addSuccessUser$ = createEffect(() => this.actions$.pipe(
        ofType(addSuccess),
        tap(() => {
            this.router.navigate(['/users']);

            Swal.fire({
                title: "Creado nuevo usuario!",
                text: "Usuario creado con exito!",
                icon: "success"
            });
        })
    ), { dispatch: false });

    updateSuccessUser$ = createEffect(() => this.actions$.pipe(
        ofType(updateSuccess),
        tap(() => {
            this.router.navigate(['/users']);

            Swal.fire({
                title: "Actualizado!",
                text: "Usuario editado con exito!",
                icon: "success"
            });
        })
    ), { dispatch: false });

    removeSuccessUser$ = createEffect(() => this.actions$.pipe(
        ofType(removeSuccess),
        tap(() => {
            // No es necesario navegar aquí si la tabla se actualiza en tiempo real
            this.router.navigate(['/users']);

            Swal.fire({
                title: "Eliminado!",
                text: "Usuario eliminado con exito.",
                icon: "success"
            });
        })
    ), { dispatch: false });

    // El constructor ahora puede estar vacío o ser eliminado.
    constructor() { }
}