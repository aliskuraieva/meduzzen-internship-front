import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, throwError, catchError } from 'rxjs';
import { User, UsersResponse } from '../core/interfaces/user.interface';
import { tap, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  getAllUsers(page: number = 1, pageSize: number = 10): Observable<User[]> {
    return this.apiService.getAllUsers(page, pageSize).pipe(
      map((response: UsersResponse) => response.detail.users || []),
      catchError((error) => {
        this.notificationService.error('Error fetching users');
        return throwError(() => error);
      })
    );
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.getUserById(id);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  updateUserProfile(id: string, user: Partial<{ username: string; password: string }>): Observable<Partial<User>> {
    const updatedUser = {
      username: user.username || '',
      password: user.password || ''
    };

    return this.apiService.updateUserProfile(id, updatedUser).pipe(
      map((response) => {
        const currentUser = this.currentUserSubject.getValue();
        if (currentUser && response.username) {
          this.setCurrentUser({ ...currentUser, username: response.username });
        }
        return response;
      })
    );
  }

  deleteUser(): Observable<void> {
    return this.apiService.deleteUser('me').pipe(
      tap(() => {
        this.setCurrentUser(null);
        this.notificationService.success('User deleted successfully');
        this.authService.logout();
      }),
      catchError((error) => {
        this.notificationService.error('Error deleting user');
        return throwError(() => error);
      })
    );
  }

  setPagination(page: number, pageSize: number): void {
    this.getAllUsers(page, pageSize).subscribe((users) => {
      this.usersSubject.next(users);
    });
  }

  get users$(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }
}
