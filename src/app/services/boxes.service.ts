import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Box } from '../models/box';
import { BehaviorSubject, Observable } from 'rxjs';
import { Panier } from '../models/panier';
import { UsersService } from './users.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {

  private readonly http: HttpClient = inject(HttpClient);

  API_URL = "http://localhost:3000/box/";
  private currentPanier = new BehaviorSubject<Box[]>([]); 
  currentPanier$ = this.currentPanier.asObservable(); 

  constructor() {
    const panier = localStorage.getItem('panier');
    this.currentPanier.next(panier ? JSON.parse(panier) : null);
  }


  getBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.API_URL + "getBoxes");
  }

  getProductsByBox(boxId: String): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL + "getProductsByBox/" + boxId);
  } 

  addBox(box: FormData): Observable<Box> {
    return this.http.post<Box>(this.API_URL + "addBox", box);
  }

  updateBox(boxId: string, box: FormData): Observable<Box> {
    return this.http.put<Box>(`${this.API_URL}updateBox/${boxId}`, box);
  }

  getBoxById(boxId: string): Observable<Box> {
    return this.http.get<Box>(this.API_URL + "getBoxById/" + boxId);
  }

  deleteBox(boxId: string): Observable<Box> {
    return this.http.delete<Box>(this.API_URL + "deleteBox/" + boxId);
  }
  purchaseBoxes(panier: Panier[] ,headers: HttpHeaders ): Observable<any> {
    return this.http.post<Panier[]>(`${this.API_URL}purchaseBoxes`, { panier: panier } , {headers})
  }

  openBox(boxId: string , headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.API_URL}boxes/${boxId}/open`  , { headers });
  }
  


  addToPanier(box: Box): void {
    const panier = this.currentPanier.value || [];
    const alreadyInPanier = panier.some(item => item._id === box._id);
  
    if (!alreadyInPanier) {
      const updatedPanier = [...panier, box];
      this.currentPanier.next(updatedPanier); 
      localStorage.setItem('panier', JSON.stringify(updatedPanier));
      console.log('Box ajoutée au panier');
    } else {
      console.log('La box est déjà dans le panier');
    }
  }

  removeFromPanier(index: number): void {
    const panier = this.currentPanier.value || [];
    const updatedPanier = [...panier];
    updatedPanier.splice(index, 1);
    this.currentPanier.next(updatedPanier);
    localStorage.setItem('panier', JSON.stringify(updatedPanier));
    console.log('Box retirée du panier');
  }
  
  updatePanier(panier: Box[]): void {
    this.currentPanier.next(panier);
    localStorage.setItem('panier', JSON.stringify(panier));
  }
  
  emptyPanier(){
    this.currentPanier.next([]);
    localStorage.removeItem('panier');
    console.log('Panier vidé');
  }
  
  clearPanierAfterPurchase(): void {
    this.currentPanier.next([]);
    this.emptyPanier(); 
    localStorage.removeItem('panier');  

    console.log('Panier vidé après achat.');

}

  

}
