import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../../../core/constants/regex.constants';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registrationForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_PATTERN), Validators.minLength(8)]),
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { email, password } = this.registrationForm.value;

      this.authService.authorizationUser(email, password).subscribe({
        next: () => {
          this.notificationService.success('User successfully logged in', 'Success');
          this.router.navigate(['/about']);
        },
        error: (error: any) => {
          this.notificationService.error(`Login failed: ${error.message || 'Something went wrong'}`, 'Error');
        }
      });
    }
  }

  registerWithAuth0(): void {
    this.authService.loginWithAuth0();
  }
}
