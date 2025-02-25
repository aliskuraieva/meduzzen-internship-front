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
import { User, UserData } from './core/interfaces/user.interface';

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
        this.currentUser = user;
        console.log('User from AuthService:', user);

        if ('id' in user) {
          this.userProfileLink = `/users/profile/${(user as User).id}`;
          console.log('Generated userProfileLink:', this.userProfileLink);
        }
      }
    });
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
