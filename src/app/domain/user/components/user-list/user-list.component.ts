import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { User } from '../../../../core/interfaces/user.interface';
import { Router } from '@angular/router';
import { PaginationResponse } from '../../../../core/interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  errorMessage: string = '';
  totalUsers: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.currentPage = Number(this.currentPage);
    this.pageSize = Number(this.pageSize);

    if (this.currentPage < 1) this.currentPage = 1;
    if (this.pageSize < 1) this.pageSize = 1;
    if (this.pageSize > 100) this.pageSize = 100;

    this.apiService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginationResponse) => {
        this.users = response.detail.users;
        this.users.sort((a, b) => a.id - b.id);
        this.totalUsers = response.detail.total;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
      },
      error: (error) => {
        this.errorMessage =
          'Error fetching users data. Please try again later.';
      },
    });
  }

  goToProfile(userId: number): void {
    this.router.navigate(['/users/profile', userId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }
}
