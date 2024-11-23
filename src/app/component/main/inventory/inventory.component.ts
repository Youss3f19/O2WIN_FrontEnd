import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private readonly userService: UsersService = inject(UsersService);
  currentUser: User | null = null;
  inventory : any[] = [];
  filteredInventory: any[] = []; 
  searchQuery: string = ''; 
  sortBy: string = '';
  


  ngOnInit(): void {
    this.userService.checkUserValidity();
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.inventory = this.currentUser?.inventory || [];
      this.filteredInventory = [...this.inventory];
      console.log(this.inventory);
      
    });    
  }
  onSearchChange(query: string): void {
    this.searchQuery = query.toLowerCase(); 
    this.filteredInventory = this.inventory.filter(item =>
      item.product.name.toLowerCase().includes(this.searchQuery)
    );
  }
  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  applyFilters(): void {
    let items = [...this.inventory];

    if (this.searchQuery) {
      items = items.filter(item =>
        item.product.name.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.sortBy === 'High') {
      items.sort((a, b) => b.product.price - a.product.price);
    } else if (this.sortBy === 'Low') {
      items.sort((a, b) => a.product.price - b.product.price);
    }

    this.filteredInventory = items;
  }

  

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

}
