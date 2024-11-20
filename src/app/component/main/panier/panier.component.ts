import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Panier } from '../../../models/panier';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent {
  private readonly userService: UsersService = inject(UsersService);
  private readonly boxesService: BoxesService = inject(BoxesService);
  private readonly router: Router = inject(Router);

  panier!: Panier[] | null;

  ngOnInit(): void {
    this.boxesService.currentPanier$.subscribe(panier => {
      if (panier) {
        this.panier = panier.map(box => ({ box, quantity: 1 })); 
      }
    });
  }

  removeFromPanier(index: number): void {
    if (this.panier) {
      this.panier.splice(index, 1);
      this.boxesService.updatePanier(this.panier.map(item => item.box));
    }
  }

  updateTotal(index: number, quantity: number): void {
    if (this.panier) {
      this.panier[index].quantity = quantity;
    }
  }

  totalPanier(): number {
    if (!this.panier) {
      return 0;
    }
    return this.panier.reduce((total, item) => total + item.box.price * item.quantity, 0);
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  purchaseAll(): void {
    if (this.panier && this.panier.length > 0) {

      const headers = this.getHeaders(); 

      this.boxesService.purchaseBoxes(this.panier,headers).subscribe(
        (response) => {
          console.log('Purchase successful:', response);
  
          // Vider le panier après l'achat
          this.boxesService.emptyPanier();
          this.panier = null;
          this.userService.checkUserValidity();

          alert(`Purchase successful! Total cost: ${response.totalCost}`);
        },
        (error) => {
          console.error('Error during purchase:', error);
        }
      );
    } else {
      alert('Your panier is empty!');
    }
  }
  
  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
