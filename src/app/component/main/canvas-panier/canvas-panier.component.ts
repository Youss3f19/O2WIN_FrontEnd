import { Component, inject } from '@angular/core';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-canvas-panier',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './canvas-panier.component.html',
  styleUrls: ['./canvas-panier.component.css'], 
})
export class CanvasPanierComponent {
  private readonly boxesService = inject(BoxesService);
  private readonly router = inject(Router);

  panier: Box[] | null = null;

  ngOnInit(): void {
    this.boxesService.currentPanier$.subscribe((panier) => {
      this.panier = panier && panier.length > 0 ? panier : null;
    });
  }

  removeFromPanier(index: number): void {
    if (this.panier) {
      this.boxesService.removeFromPanier(index);
      if (this.panier.length === 0) {
        this.boxesService.emptyPanier();
      }
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
