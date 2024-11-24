import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { Auth } from '../models/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  API_URL = 'http://localhost:3000/user/';

  private currentUserSubject = new BehaviorSubject<User | null>(null); 
  currentUser$ = this.currentUserSubject.asObservable(); 

  constructor() {
    this.checkUserValidity();
  }

  signup(user: Auth): Observable<User> {
    return this.http.post<User>(this.API_URL + 'signup', user);
  }

  login(auth: Auth): Observable<Auth> {
    return this.http.post<Auth>(this.API_URL + 'login', auth);
  }

  resetPassword(currentPassword : string , newPassword : string , headers : HttpHeaders): Observable<{ message: string }>{
    return this.http.post<{ message: string }>(this.API_URL + 'resetPassword', { currentPassword, newPassword }, { headers });
  }

  verifyToken(token: string): Observable<any> {
    return this.http.post<any>(this.API_URL + 'verifyToken', { token });
  }

  getUserById(userId: string): Observable<User>{
    return this.http.get<User>(this.API_URL + "userbyid/" + userId);
  }

  logout(): void {
    this.setCurrentUser(null);
    localStorage.removeItem('authToken');
    this.router.navigate(['/main/auth/login'])
    }



  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user); 
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value; 
  }

  checkUserValidity(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.verifyToken(token).subscribe((res) => {
        this.getUserById(res.user._id).subscribe(
          (user) => {
            this.setCurrentUser(user);
          }  
        )
      }, (err) => {
        this.setCurrentUser(null);
        localStorage.removeItem('authToken');
      });
    } else {
      this.setCurrentUser(null);
    }
  }

 


}
