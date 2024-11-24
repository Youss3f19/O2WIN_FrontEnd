import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent implements OnInit {

  private readonly productService: ProductsService = inject(ProductsService);
  products!: Product[] ;
  filteredProducts!: Product[] ;
  filterCriteria: { name: string; category: string; minPrice: number | null; maxPrice: number | null; rarity: string } = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    rarity: ''
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        console.log(products);
        this.products = products;
        this.filteredProducts = products; 
      }
    );
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(this.filterCriteria.name.toLowerCase());
      const matchesCategory = this.filterCriteria.category
        ? product.categories.some(category => category.name === this.filterCriteria.category)
        : true;
      const matchesMinPrice = this.filterCriteria.minPrice !== null ? product.price >= this.filterCriteria.minPrice : true;
      const matchesMaxPrice = this.filterCriteria.maxPrice !== null ? product.price <= this.filterCriteria.maxPrice : true;
      const matchesRarity = this.filterCriteria.rarity ? product.rarity.name === this.filterCriteria.rarity : true;

      return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRarity;
    });
  }

  resetFilters(): void {
    this.filterCriteria = { name: '', category: '', minPrice: null, maxPrice: null, rarity: '' };
    this.filteredProducts = this.products;
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(
      (response) => {
        console.log('Product deleted successfully', response);
        this.products = this.products.filter(product => product._id !== productId);
        this.applyFilters(); 
      },
      (error) => console.error('Error deleting product', error)
    );
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
