import { createAction, props } from '@ngrx/store';

export const changeTestString = createAction(
  '[Test String] Change',
  props<{ newTestString: string }>()
);
