import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-changermdp',
  standalone: true,
  imports: [ReactiveFormsModule , TitleCasePipe , NgClass],
  templateUrl: './changermdp.component.html',
  styleUrls: ['./changermdp.component.css']
})
export class ChangermdpComponent implements OnInit{
  private readonly userService: UsersService = inject(UsersService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  resetPasswordForm!: FormGroup;
  messageResponse!: string;

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  
  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { currentPassword , newPassword , confirmPassword } = this.resetPasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.messageResponse = 'Passwords do not match!';
      return;
    }

    const headers = this.getHeaders();
    console.log(headers);
    console.log(currentPassword);
    console.log(newPassword);
    
    
    
    this.userService.resetPassword(currentPassword, newPassword, headers).subscribe(
       (response) => {
        console.log('Password changed successfully', response);
        this.messageResponse = 'Password changed successfully';
      },
      (error) => {
          console.error('Error changing password', error);
          this.messageResponse = error.error.message;
        }
    );
  }
}
