import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');

    const clonedReq = accessToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        console.log('error', error);

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      if (!refreshToken) {
        console.error('Refresh token missing');
        // this.authService.logout();
        return throwError(() => new Error('Refresh token missing'));
      }

      return this.authService.refreshAccessToken().pipe(
        switchMap((newToken) => {
          this.refreshTokenInProgress = false;
          console.log('newToken', newToken);

          if (newToken) {
            console.log('New tokens received', newToken);
            localStorage.setItem('access_token', newToken.detail.data.accessToken);
            localStorage.setItem('refresh_token', newToken.detail.data.refreshToken);
            this.refreshTokenSubject.next({
              accessToken: newToken.detail.data.accessToken,
              refreshToken: newToken.detail.data.refreshToken,
            });
            return next.handle(
              req.clone({
                setHeaders: { Authorization: `Bearer ${newToken.detail.data.accessToken}` },
              })
            );
          }
          console.error('Failed to refresh token');
          // this.authService.logout();
          return throwError(() => new Error('Refresh token failed'));
        }),
        catchError((error) => {
          this.refreshTokenInProgress = false;
          console.error('Error during token refresh', error);
          // this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          console.log('Retrying request with new access token');
          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token?.accessToken}` },
            })
          );
        })
      );
    }
  }
}
