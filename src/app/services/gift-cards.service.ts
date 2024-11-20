import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GiftCard } from '../models/gift-card';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GiftCardsService {

  constructor() { }

  private readonly http:HttpClient = inject(HttpClient);
  API_URL="http://localhost:3000/giftCard/";


  redeemGiftCard(code  : string , headers : HttpHeaders) : Observable<GiftCard>{
    return this.http.post<GiftCard>(this.API_URL + "redeem/" , { code }, { headers });
  }


}
