import { createReducer, on } from '@ngrx/store';
import { changeTestString } from './app.actions';

export interface AppState {
  testString: string;
}

export const initialState: AppState = {
  testString: 'Initial test string',
};

export const appReducer = createReducer(
  initialState,
  on(changeTestString, (state, { newTestString }) => ({
    ...state,
    testString: newTestString,
  }))
);
