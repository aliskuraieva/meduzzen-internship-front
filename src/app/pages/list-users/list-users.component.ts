import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent {
  users = [{ name: 'User 1' }, { name: 'User 2' }];
}
