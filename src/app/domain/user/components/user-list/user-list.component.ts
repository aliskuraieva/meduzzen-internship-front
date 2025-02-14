import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (usersData) => {
        this.users = usersData;
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
