import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: { username: string; email: string; id: number; picture?: string; createdAt?: string; updatedAt?: string } = { username: '', email: '', id: 0 };
  originalUser: { username: string; email: string } = { username: '', email: '' };
  isEditing = false;
  isAuthenticated$: Observable<boolean>;
  editedUser: { username: string; password?: string } = { username: '' };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
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
          if (!userData || !userData.detail?.username || !userData.detail?.email) {
            console.error('Invalid user data:', userData);
            return;
          }

          this.user = { ...userData.detail };
          this.originalUser = { ...userData.detail };
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  editProfile(): void {
    this.isEditing = true;
    this.editedUser = { username: this.user.username, password: '' };
    console.log('Editing profile for:', this.user);
  }

  saveProfile(): void {
    console.log('Sending update request with:', this.editedUser);

    const updatedUser: { username: string; password?: string } = { username: this.editedUser.username };

    if (this.editedUser.password?.trim()) {
      updatedUser.password = this.editedUser.password;
    }

    this.apiService.updateUserProfile(this.user.id.toString(), updatedUser).subscribe({
      next: (updatedUserResponse) => {
        console.log('Profile update response:', updatedUserResponse);

        if (updatedUserResponse?.detail?.username) {
          this.user.username = updatedUserResponse.detail.username;
          this.originalUser.username = updatedUserResponse.detail.username;
          this.authService.setCurrentUser({ ...this.user, username: updatedUserResponse.detail.username });

          this.isEditing = false;

          this.router.navigate(['/users/profile']);
        } else {
          console.error('Invalid response format:', updatedUserResponse);
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      },
    });
  }


  cancelEdit(): void {
    this.editedUser = { username: this.originalUser.username };
    this.isEditing = false;
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.userService.deleteUser().subscribe({
        next: () => {
          this.router.navigate(['/about']);
        },
        error: (error) => {
          console.error('Error deleting profile:', error);
        }
      });
    }
  }
}
