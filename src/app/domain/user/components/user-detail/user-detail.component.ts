import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user: { username: string; email: string } = { username: '', email: '' };
  originalUser: { username: string; email: string } = { username: '', email: '' };
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
          return userId ? this.apiService.getUserById(userId) : this.apiService.getCurrentUser();
        })
      )
      .subscribe({
        next: (userData) => {
          if (!userData || !userData.detail?.username || !userData.detail?.email) {
            console.error('Invalid user data:', userData);
            return;
          }

          console.log('User data received:', userData);
          this.user = { ...userData.detail };
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }
}
