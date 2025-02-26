import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ModalComponent } from './shared/modal/modal.component';
import { changeTestString } from './core/state/app.actions';
import { selectTestString } from './core/state/app.selectors';
import { AppState } from './core/state/app.state';
import { AuthService } from './core/auth/auth.service';
import { UserData, Auth0User } from './core/interfaces/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isModalVisible = false;
  readonly testString$: Observable<string>;
  readonly apiUrl = import.meta.env['NG_APP_PUBLIC_API_URL'] ?? '';
  userProfileLink = '/users/profile';
  currentUser: UserData | null = null;

  constructor(private store: Store<AppState>, private authService: AuthService) {
    this.testString$ = this.store.select(selectTestString);

    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.setUser(user, 'AuthService');
      }
    });
  }

  private setUser(user: UserData | Auth0User, source: string): void {
    if (this.isAuth0User(user)) {
      this.currentUser = this.mapAuth0UserToUserData(user);
    } else {
      this.currentUser = user;
    }

    console.log(`User from ${source}:`, this.currentUser);

    if (this.currentUser?.id) {
      this.userProfileLink = `/users/profile/${this.currentUser.id}`;
      console.log('Generated userProfileLink:', this.userProfileLink);
    }
  }

  private isAuth0User(user: any): user is Auth0User {
    return 'sub' in user || 'email' in user || 'nickname' in user;
  }

  private mapAuth0UserToUserData(auth0User: Auth0User): UserData {
    return {
      id: auth0User.sub ?? '',
      email: auth0User.email ?? '',
      username: auth0User.nickname ?? auth0User.email ?? 'Unknown',
    };
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

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isModalVisible) {
      this.closeModal();
    }
  }
}
