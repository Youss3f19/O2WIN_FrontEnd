import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';
import { BoxesService } from '../../../services/boxes.service';
import { Product } from '../../../models/product';
import { CanvasPanierComponent } from "../canvas-panier/canvas-panier.component";
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CanvasPanierComponent , DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit  {
  private readonly userService: UsersService = inject(UsersService);
  private readonly boxService: BoxesService = inject(BoxesService);

  currentUser: User | null = null;
  panier!:Product[]  
  nbItems!: number 


  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
      console.log('Current User Header:', this.currentUser);
    });
    this.boxService.currentPanier$.subscribe((panier) => {
      console.log('État actuel du panier :', panier);
      this.nbItems = panier?.length || 0
    });
  
  }

  logout(): void {
    this.userService.logout();
    this.boxService.emptyPanier();
  }
}
