import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: { username: string; email: string } = { username: '', email: '' };
  isEditing = false;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = params.get('id');
          return userId
            ? this.apiService.getUserById(userId)
            : this.apiService.getCurrentUser();
        })
      )
      .subscribe({
        next: (userData) => {
          if (
            !userData ||
            !userData.detail.username ||
            !userData.detail.email
          ) {
            console.error('Invalid user data:', userData);
            return;
          }

          console.log('User data received:', userData);
          this.user = userData;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  logout(): void {
    this.authService.logout();
  }

  editProfile(): void {
    this.isEditing = true;
    console.log('Editing profile for:', this.user);
  }

  saveProfile(): void {
    console.log('Profile saved:', this.user);
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }
}
