import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: { name: string, email: string } = { name: '', email: '' };

  constructor() { }

  ngOnInit(): void {
    this.user = {
      name: '',
      email: ''
    };
  }

  editProfile(): void {

    console.log('Editing profile for:', this.user);
  }
}
