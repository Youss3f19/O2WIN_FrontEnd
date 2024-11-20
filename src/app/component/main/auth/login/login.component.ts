import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../../models/auth';
import { Router } from '@angular/router';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../auth.component.css']
})
export class LoginComponent implements OnInit {
  private readonly userService: UsersService = inject(UsersService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
 
  userForm!: FormGroup;
  errorMessage!:string

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const loginData =  {
        email : this.userForm.value.email,
        password : this.userForm.value.password,
      };
      this.userService.login(loginData).subscribe(
        (response : any) => {
          console.log('User logged in successfully', response);
          localStorage.setItem('authToken', response.mytoken);
          this.userService.setCurrentUser(response.user) 
          this.errorMessage =""
          this.router.navigate(['/main/list-boxes']);
        },
        (error) => {
          console.error('Error logging in', error);
          this.errorMessage = error.error;
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  
}
