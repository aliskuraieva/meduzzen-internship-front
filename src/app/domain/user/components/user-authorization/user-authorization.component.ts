import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { RegisterResponse } from '../../../../core/interfaces/register-response.interface';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../../../core/constants/regex.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-authorization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-authorization.component.html',
  styleUrls: ['./user-authorization.component.scss']
})
export class UserAuthorizationComponent {
  authorizationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authorizationForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_PATTERN), Validators.minLength(8)]),
    });
  }

  onSubmit() {
    if (this.authorizationForm.valid) {
      const { email, password } = this.authorizationForm.value;

      this.authService.authorizationUser(email, password).subscribe({
        next: (response: RegisterResponse) => {
          alert('User successfully registered');
          this.router.navigate(['/about']);
        },
        error: (error: any) => {
          alert(`Registration failed: ${error.message || 'Something went wrong'}`);
        }
      });
    }
  }

  loginWithAuth0(): void {
    this.authService.loginWithAuth0();
  }

}
