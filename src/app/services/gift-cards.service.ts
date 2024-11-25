import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GiftCard } from '../models/gift-card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';

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

  generateGiftCards( numberOfCards : number , value : number , headers : HttpHeaders ) : Observable<GiftCard>{
    return this.http.post<GiftCard>(this.API_URL + "generate/" , { numberOfCards , value}, {headers});
  }

  getAllGiftCards(headers: HttpHeaders): Observable<GiftCard[]> {
    return this.http.get<GiftCard[]>(this.API_URL + "getAllGiftCards/", { headers });
}


}
