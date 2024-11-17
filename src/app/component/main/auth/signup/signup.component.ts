import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../auth.component.css']
})
export class SignupComponent implements OnInit {
  private readonly userService: UsersService = inject(UsersService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);

  userForm!: FormGroup;
  errorMessage!:string

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = new User(
        this.userForm.value.name,
        this.userForm.value.lastname,
        this.userForm.value.email,
        this.userForm.value.password,
      );
      this.userService.signup(newUser).subscribe(
        (response: any) => {
          console.log('User created successfully', response);
          this.router.navigate(['/main/auth/login']);
        },
        (error: any) => {
          console.error('Error creating user', error);
          this.errorMessage = error.error

        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
