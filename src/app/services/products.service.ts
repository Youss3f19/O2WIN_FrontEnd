import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  private readonly http:HttpClient = inject(HttpClient);
  API_URL="http://localhost:3000/product/";

  getProducts(): Observable<Product[]>  {
    return this.http.get<Product[]>(this.API_URL + "products");
  }
  
  getProductById(id: string): Observable<Product>  {
    return this.http.get<Product>(this.API_URL + "product/" + id);
  }

  addProduct(product: FormData): Observable<Product> {    
    return this.http.post<Product>(this.API_URL + "addProduct", product);
  }

  updatteredProduct(productId: string,  product: FormData): Observable<Product> {
    return this.http.put<Product>(this.API_URL + "updateProduct/" + productId, product);
  }

  

  
}
