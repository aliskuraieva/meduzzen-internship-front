import { createAction, props } from '@ngrx/store';

export const changeTestString = createAction(
  '[Test String] Change',
  props<{ newValue: string }>()
);
