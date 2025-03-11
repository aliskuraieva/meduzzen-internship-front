import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { User } from '../../../../core/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.detail.users;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching users data. Please try again later.';
        console.error('Error fetching users data:', error);
      }
    });
  }

  goToProfile(userId: number): void {
    this.router.navigate(['/users/profile', userId]);
  }
}
