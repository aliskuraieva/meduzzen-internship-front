import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { changeTestString } from './app.actions';

@Injectable()
export class AppEffects {

  loadData$ = createEffect(() => this.actions$.pipe(
    ofType(changeTestString),
    mergeMap(() => this.apiService.checkHealth()
      .pipe(
        map(data => changeTestString({ newTestString: data })),
        catchError(() => EMPTY)
      ))
  ));

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
