import { Component, inject, OnInit } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GiftCardsService } from '../../../services/gift-cards.service';
import { HttpHeaders } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-payement',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,NgClass],
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent implements OnInit {

  private readonly giftCardService: GiftCardsService = inject(GiftCardsService);
  private readonly userService: UsersService = inject(UsersService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  codeForm!: FormGroup; 
  messageResponse!: string
  ngOnInit(): void {
    this.codeForm = this.fb.group({
      code: [
        '', 
        [ 
          Validators.required, 
          Validators.pattern('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') 
        ]
      ]
    });
  }
  
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  onSubmit(): void {
    if (this.codeForm.valid) {
      const code = this.codeForm.value.code;
      const headers = this.getHeaders();
      
      this.giftCardService.redeemGiftCard(code, headers).subscribe(
        (response) => {
          console.log('Payment verified:', response);
          this.messageResponse = "Payment verified"
          this.userService.checkUserValidity();
          this.codeForm.reset();
        },
        (error) => {
          this.messageResponse = error.error.message;
          console.error('Error verifying payment:', error);
        }
      );
    } else {
      console.error('Invalid code form');
    }
  }


  
}
