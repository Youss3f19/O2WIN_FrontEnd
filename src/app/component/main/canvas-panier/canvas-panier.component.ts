import { Component, inject } from '@angular/core';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas-panier',
  standalone: true,
  templateUrl: './canvas-panier.component.html',
  styleUrls: ['./canvas-panier.component.css'], 
})
export class CanvasPanierComponent {
  private readonly boxesService = inject(BoxesService);
  private readonly router = inject(Router);

  panier: Box[] | null = null;

  ngOnInit(): void {
    this.boxesService.currentPanier$.subscribe((panier) => {
      this.panier = panier || null;
      console.log('Panier : ', panier);
    });
  }

  removeFromPanier(index: number): void {
    this.boxesService.removeFromPanier(index);
    if (this.panier && this.panier.length === 0) {
      this.boxesService.emptyPanier();
      this.panier = null;
    }
  }

  emptyPanier(): void {
    this.boxesService.emptyPanier();
    this.panier = null;
  }

  checkout(): void {
    this.router.navigate(['/main/panier']);
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
