import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private readonly userService: UsersService = inject(UsersService);
  currentUser: User | null = null;
  inventory : any[] = [];
  selectedProduct: any = null;


  ngOnInit(): void {
    this.userService.checkUserValidity();
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.inventory = this.currentUser?.inventory || [];
      console.log(this.inventory);
      
    });    
  }

  

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

}
