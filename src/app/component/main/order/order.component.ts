import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { FormsModule } from '@angular/forms';
import { CommandesService } from '../../../services/commandes.service';
import { HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  private readonly userService: UsersService = inject(UsersService);
  private readonly commandService: CommandesService = inject(CommandesService);
  currentUser: User | null = null;
  inventory: any[] = [];
  searchQuery: string = '';
  filteredInventory: any[] = [];
  selectedItems: any[] = [];

  ngOnInit(): void {
    this.userService.checkUserValidity();
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.inventory = this.currentUser?.inventory || [];
      this.filteredInventory = [...this.inventory];
    });
  }

  filterItems(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredInventory = [...this.inventory];
    } else {
      this.filteredInventory = this.inventory.filter((item) =>
        item.product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  selectItem(item: any): void {
    this.selectedItems.push(item);
  
    this.filteredInventory = this.filteredInventory.filter(i => i !== item);
    this.inventory = this.inventory.filter(i => i !== item);
  
    console.log('Selected Items:', this.selectedItems);
  }
  removeItem(item: any): void {
    this.selectedItems = this.selectedItems.filter(selected => selected !== item);
  
    this.inventory.push(item);
    this.filteredInventory.push(item);
  
    console.log('Updated Selected Items:', this.selectedItems);
    console.log('Updated Inventory:', this.inventory);
  }
  
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  addCommand(): void {
    const formattedProducts = this.selectedItems.map(item => ({
      product: item.product._id, 
      quantity: item.quantity,
    }));
  
    const commandPayload = { products: formattedProducts };
  
    const header = this.getHeaders();
  
    this.commandService.addCommand(commandPayload, header).subscribe(
      (response) => {
        console.log('Command added:', response);
        this.selectedItems = [];
      },
      (error) => {
        console.error('Error adding command:', error);
      }
    );
  }

 

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }


}
