import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent  implements OnInit {
  private readonly userService: UsersService = inject(UsersService);
  currentAdmin: User | null = null;
  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentAdmin = user; 
    });
  }
}
