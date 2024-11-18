import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit  {
  private readonly userService: UsersService = inject(UsersService);
  currentUser: User | null = null;



  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
      console.log('Current User:', this.currentUser);
    });
  }




  isLoggedIn(): boolean {
    return this.userService.getLoggedIn() 
  }
  logout(): void {
    this.userService.logout();
  }
}
