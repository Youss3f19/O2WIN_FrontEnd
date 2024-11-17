import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly userService: UsersService = inject(UsersService);
  isLoggedIn(): boolean {
    return this.userService.getLoggedIn() 
  }
  logout(): void {
    this.userService.logout();
  }
}
