import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [NgClass,RouterLink],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent implements OnInit  {

  private readonly productService:ProductsService = inject(ProductsService);
  products: Product[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        console.log(products);
        
        this.products = products;
    });
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

}
