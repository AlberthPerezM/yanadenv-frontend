import { createAction, props } from "@ngrx/store";
import { User } from "../../core/models/user";

export const load = createAction('load', props<{ page: number }>());

export const resetUser = createAction('resetUser');
export const findAll = createAction('findAll', props<{ users: User[] }>());
export const findAllPageable = createAction('findAllPageable', props<{ users: User[], paginator: any }>());
export const setPaginator = createAction('setPaginator', props<{ paginator: any }>());
export const find = createAction('find', props<{ id: number }>());

export const add = createAction('add', props<{ userNew: User }>());
export const addSuccess = createAction('addSuccess', props<{ userNew: User }>());
export const update = createAction('update', props<{ userUpdated: User }>());
export const updateSuccess = createAction('updateSuccess', props<{ userUpdated: User }>());
export const remove = createAction('remove', props<{ id: number }>());
export const removeSuccess = createAction('removeSuccess', props<{ id: number }>());

export const setErrors = createAction('setErrors', props<{ userForm: User, errors: any }>());