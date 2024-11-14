  import { HttpClient } from '@angular/common/http';
  import { inject, Injectable } from '@angular/core';
  import { Box } from '../models/box';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class BoxesService {

    private readonly http:HttpClient = inject(HttpClient);
    API_URL="http://localhost:3000/box/";

    getBoxes():Observable<Box[]>  {
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
    

  }
