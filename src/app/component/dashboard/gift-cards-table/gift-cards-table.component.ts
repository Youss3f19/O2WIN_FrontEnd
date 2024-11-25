import { Component, inject, OnInit } from '@angular/core';
import { GiftCardsService } from '../../../services/gift-cards.service';
import { GiftCard } from '../../../models/gift-card';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gift-cards-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './gift-cards-table.component.html',
  styleUrl: './gift-cards-table.component.css'
})
export class GiftCardsTableComponent implements OnInit {
  private readonly giftCardsService: GiftCardsService = inject(GiftCardsService);


  giftCards!: GiftCard[];

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  ngOnInit(): void {
    const headers = this.getHeaders()
    this.giftCardsService.getAllGiftCards(headers).subscribe(
      (giftCards) => {
        this.giftCards = giftCards;
        console.log(giftCards);
        
    });
  }

}
