import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { BoxComponent } from "../box/box.component";

@Component({
  selector: 'app-myboxes',
  standalone: true,
  imports: [],
  templateUrl: './myboxes.component.html',
  styleUrl: './myboxes.component.css'
})
export class MyboxesComponent {
  private readonly userService: UsersService = inject(UsersService);
  currentUser: User | null = null;
  boxes : any[] = [];


  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
      console.log('Current User:', this.currentUser);
    });
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
