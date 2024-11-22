import { Component, inject } from '@angular/core';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas-panier',
  standalone: true,
  imports: [],
  templateUrl: './canvas-panier.component.html',
  styleUrl: './canvas-panier.component.css'
})
export class CanvasPanierComponent {
  private readonly boxesService : BoxesService= inject(BoxesService);
  private readonly router : Router= inject(Router);

  panier!:Box[] | null;

  ngOnInit(): void {
    this.boxesService.currentPanier$.subscribe(panier => {
      this.panier = panier;
      console.log("Panier : "+panier);
      
  
    });
  }
  removeFromPanier(index : number): void {
    this.boxesService.removeFromPanier(index);
  }
  
  emptyPanier(){
    this.boxesService.emptyPanier();
  }

  checkout(){
    this.router.navigate(['/main/panier']);
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
