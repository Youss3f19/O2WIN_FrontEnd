import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Box } from '../models/box';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {

  private readonly http: HttpClient = inject(HttpClient);
  API_URL = "http://localhost:3000/box/";

  getBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.API_URL + "getBoxes");
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
  purchaseBox(boxId: string ,headers: HttpHeaders): Observable<any> {
    return this.http.post<any>(`${this.API_URL}purchaseBox/${boxId}`, { headers });
  }

  openBox(boxId: string , headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.API_URL}boxes/${boxId}/open`  , { headers });
  }

  


}
