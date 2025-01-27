import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-authorization',
  templateUrl: './user-authorization.component.html',
  styleUrls: ['./user-authorization.component.scss']
})
export class UserAuthorizationComponent {
  loginForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.loginForm.valid) {
      console.log('Form Data:', this.loginForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  get formControls() {
    return this.loginForm.controls;
  }
}
