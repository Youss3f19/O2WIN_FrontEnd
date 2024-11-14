import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rarity } from '../models/rarity';

@Injectable({
  providedIn: 'root'
})
export class RarityService {

  constructor() { }

  private readonly http:HttpClient = inject(HttpClient);
  API_URL="http://localhost:3000/rarity/";


  getRarities(): Observable<Rarity[]> {
    return this.http.get<Rarity[]>(this.API_URL + "getAllRarity");
  }



  
}
