import { Component, inject, OnInit } from '@angular/core';
import { BoxesService } from '../../../services/boxes.service';
import { CategoryService } from '../../../services/category.service';
import { Box } from '../../../models/box';
import { Category } from '../../../models/category';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-box-table',
  standalone: true,
  imports: [NgClass, RouterLink , FormsModule],
  templateUrl: './box-table.component.html',
  styleUrl: './box-table.component.css',
})
export class BoxTableComponent implements OnInit {
  private readonly boxService: BoxesService = inject(BoxesService);
  private readonly categoryService: CategoryService = inject(CategoryService);

  boxes!: Box[] ;
  filteredBoxes!: Box[] ;
  allCategories!: Category[];

  // Filter properties
  nameFilter: string = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  selectedCategory: string = '';

  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadBoxes();
    this.loadCategories();
  }

  loadBoxes(): void {
    this.isLoading = true;
    this.boxService.getBoxes().subscribe(
      (boxes) => {
        this.boxes = boxes;
        this.filteredBoxes = boxes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading boxes:', error);
        this.isLoading = false;
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategorys().subscribe(
      (categories) => {
        this.allCategories = categories;
        console.log(categories);
        
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredBoxes = this.boxes.filter((box) => {
      const matchesName = this.nameFilter === '' ||
        box.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      const matchesPrice =
        (this.priceMin === null || box.price >= this.priceMin) &&
        (this.priceMax === null || box.price <= this.priceMax);

      const matchesCategory =
        this.selectedCategory === '' ||
        box.categories.some((cat) => cat._id === this.selectedCategory);

      return matchesName && matchesPrice && matchesCategory;
    });
  }

  deleteBox(boxId: string): void {
    this.isLoading = true;
    this.boxService.deleteBox(boxId).subscribe(
      () => {
        this.boxes = this.boxes.filter((box) => box._id !== boxId);
        this.applyFilters(); 
        this.isLoading = false;
      },
      (error) => {
        console.error('Error deleting box:', error);
        this.isLoading = false;
      }
    );
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

 
}
