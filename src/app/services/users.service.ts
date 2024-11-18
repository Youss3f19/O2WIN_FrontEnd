import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly http: HttpClient = inject(HttpClient);
  API_URL = "http://localhost:3000/user/";

  private isLoggedIn!: boolean;  

  constructor() { 
    this.checkUserValidity();
  }


  signup(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL + "signup", user);
  }

  login(auth: Auth): Observable<Auth> {
    return this.http.post<Auth>(this.API_URL + "login", auth);
  }

  verifyToken(token: string): Observable<any> { 
    return this.http.post<any>(this.API_URL + "verifyToken", { token });
  }

  logout(): void {
    this.setLoggedIn(false);
    localStorage.removeItem('authToken'); 
  }

  setLoggedIn(status: boolean): void {
    this.isLoggedIn = status;
  }
  getLoggedIn(): boolean {
    return this.isLoggedIn;
  }
  checkUserValidity(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.verifyToken(token).subscribe((res) => {
        this.setLoggedIn(true);
      }, (err) => {
        this.setLoggedIn(false);
        localStorage.removeItem('authToken');
      });
    } else {
      this.setLoggedIn(false);
    }
  }

}
