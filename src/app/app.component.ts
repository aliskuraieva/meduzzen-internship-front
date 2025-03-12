import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ModalComponent } from './shared/modal/modal.component';
import { changeTestString } from './core/state/app.actions';
import { selectTestString } from './core/state/app.selectors';
import { AppState } from './core/state/app.state';
import { AuthService } from './core/auth/auth.service';
import { UserData } from './core/interfaces/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isModalVisible = false;
  readonly testString$: Observable<string>;
  readonly isAuthenticated$: Observable<boolean>;
  readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'] ?? '';
  userProfileLink = '/users/profile';
  currentUser: UserData | null = null;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.testString$ = this.store.select(selectTestString);
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.authService.loadUserData();

    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('isAuthenticated changed:', isAuthenticated);
      if (isAuthenticated) {
        this.authService.getUser().subscribe((user) => {
          if (user) {
            this.setUser(user, 'AuthService');
          } else {
            console.warn('No user data received from AuthService');
          }
        });
      }
    });

  }

  private setUser(user: UserData, source: string): void {
    if (!user) {
      console.error(`No user data from ${source}`);
      return;
    }

    this.currentUser = user;

    if (this.currentUser?.id) {
      this.userProfileLink = `/users/profile/${this.currentUser.id}`;
    }
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  changeTestString(): void {
    this.store.dispatch(changeTestString({ newTestString: 'New Test String' }));
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.userProfileLink = '/users/profile';
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isModalVisible) {
      this.closeModal();
    }
  }
}
