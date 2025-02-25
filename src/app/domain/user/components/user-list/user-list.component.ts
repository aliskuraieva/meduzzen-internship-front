import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { User } from '../../../../core/interfaces/user.interface';
import { UsersResponse } from '../../../../core/interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (response: UsersResponse) => {
        this.users = response.detail.users;
        console.log('this.users', this.users);
      },
      error: (error) => {
        console.error('Error fetching users data:', error);
      },
      complete: () => {
        console.log('Request complete');
      }
    });
  }

}
