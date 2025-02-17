import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { RegisterResponse } from '../../../../core/interfaces/register-response.interface';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../../../core/constants/regex.constants';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
        password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_PATTERN), Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { email, password } = this.registrationForm.value;

      this.authService.registerUser(email, password).subscribe({
        next: (response: RegisterResponse) => {
          alert('User successfully registered');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          alert(`Registration failed: ${error.message || 'Something went wrong'}`);
        }
      });
    }
  }
}
