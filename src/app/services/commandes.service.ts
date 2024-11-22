import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Commande } from '../models/commande';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  private readonly http:HttpClient = inject(HttpClient);
  API_URL="http://localhost:3000/command/";

  constructor() { }


  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.API_URL + "getAllCommands");
  }
  addCommand(products: any , headers : HttpHeaders): Observable<Commande>{
    return this.http.post<Commande>(this.API_URL + "create", products , { headers });
  }





}
