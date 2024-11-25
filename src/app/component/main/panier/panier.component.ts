import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Panier } from '../../../models/panier';
import { UsersService } from '../../../services/users.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, ModalComponent],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'], 
})
export class PanierComponent {
  private readonly userService = inject(UsersService);
  private readonly boxesService = inject(BoxesService);
  private readonly router = inject(Router);

  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  panier: Panier[] | null = null;

  ngOnInit(): void {
    this.boxesService.currentPanier$.subscribe((panier) => {
      if (panier) {
        this.panier = panier.map((box) => ({ box, quantity: 1 }));
      } else {
        this.panier = null; 
      }
    });
  }

  removeFromPanier(index: number): void {
    if (this.panier) {
      this.panier.splice(index, 1);
      this.boxesService.updatePanier(this.panier.map((item) => item.box));

      if (this.panier.length === 0) {
        this.boxesService.emptyPanier();
        this.panier = null;
      }
    }
  }

  updateTotal(index: number, quantity: number): void {
    if (this.panier) {
      this.panier[index].quantity = quantity;
    }
  }

  totalPanier(): number {
    return this.panier?.reduce((total, item) => total + item.box.price * item.quantity, 0) ?? 0;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  purchaseAll(): void {
    if (this.panier && this.panier.length > 0) {
      const headers = this.getHeaders();
  
      this.boxesService.purchaseBoxes(this.panier, headers).subscribe(
        (response) => {
          console.log('Purchase successful:', response);
          this.modalTitle = 'Purchase successful ';
          this.modalMessage = `Purchase successful! Total cost: ${response.totalCost}`;
          this.showModal = true;
          // Vider le panier dans le service
          this.boxesService.clearPanierAfterPurchase();
  
          // Vider le panier localement
          this.panier = null;
  
          // Vérifier la validité de l'utilisateur après l'achat
          this.userService.checkUserValidity();
  
        },
        (error: HttpErrorResponse) => {
          console.error('Error during purchase:', error);
          this.modalTitle = 'Error during purchase';
          this.modalMessage = '';
          this.showModal = true;
        }
      );
    } else {
      this.modalTitle = 'Empty';
          this.modalMessage = 'Your cart is empty';
          this.showModal = true;
      
    }
  }
  

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
