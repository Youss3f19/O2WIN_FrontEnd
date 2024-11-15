import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }
  private readonly http:HttpClient = inject(HttpClient);
  API_URL="http://localhost:3000/category/";

  getCategorys():Observable<Category[]>  {
    return this.http.get<Category[]>(this.API_URL + "categories");
  }

  updateCategory(id:string,category:FormData):Observable<Category>{
    return this.http.put<Category>(this.API_URL + "updateCategory/" + id, category);
  }

  addCategory(category:FormData):Observable<Category[]> {
    return this.http.post<Category[]>(this.API_URL + "addCategory", category);
  }

  getCategoryById(id:string):Observable<Category>{
    return this.http.get<Category>(this.API_URL + "categories/" + id);
  }



}
