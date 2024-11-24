import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GiftCardsService } from '../../../services/gift-cards.service';

@Component({
  selector: 'app-generate-gift-cards',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './generate-gift-cards.component.html',
  styleUrl: './generate-gift-cards.component.css'
})
export class GenerateGiftCardsComponent implements OnInit  {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly giftCardsService: GiftCardsService = inject(GiftCardsService);

  giftCardsForm!: FormGroup;

  ngOnInit(): void {
    this.giftCardsForm = this.fb.group({
      value: [ 10, [Validators.required, Validators.min(10), Validators.max(1000) , Validators.pattern('[0-9]*'), ]],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100) , Validators.pattern('[0-9]*')]]
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
    if (this.giftCardsForm.valid) {
      const headers = this.getHeaders()
      const { quantity, value } = this.giftCardsForm.value;
  
      this.giftCardsService.generateGiftCards(quantity, value, headers).subscribe(
         (response) => {
          console.log('Gift cards generated successfully:', response);
          alert('Gift cards generated successfully!');
        },
         (error) => {
          console.error('Error generating gift cards:', error);
          alert('Failed to generate gift cards. Please try again.');
        }
      );
    } else {
      console.error('Form is invalid:', this.giftCardsForm.errors);
        alert('Please fix the form errors before submitting.');
    }
  }
  
}
