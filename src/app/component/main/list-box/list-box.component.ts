import { Component, inject, OnInit } from '@angular/core';
import { BoxComponent } from "../box/box.component";
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { LoaderComponent } from '../../loader/loader.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-box',
  standalone: true,
  imports: [BoxComponent, LoaderComponent, FormsModule],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.css'
})
export class ListBoxComponent implements OnInit {
  private readonly boxesService: BoxesService = inject(BoxesService);
  private readonly categoryService: CategoryService = inject(CategoryService);

  boxes: Box[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;
  selectedCategory: string = ''; // For category filter
  searchQuery: string = ''; // For search by name filter

  ngOnInit(): void {
    this.loadCategories();
    this.loadBoxes();
  }

  loadCategories(): void {
    this.categoryService.getCategorys().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadBoxes(): void {
    this.isLoading = true;
    this.boxesService.getBoxes().subscribe(
      (boxes) => {
        this.boxes = boxes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading boxes:', error);
        this.isLoading = false;
      }
    );
  }

  filterBoxes(): void {
    this.boxesService.getBoxes().subscribe(
      (boxes) => {
        this.boxes = boxes.filter(box =>
          (this.selectedCategory ? box.categories.some(cat => cat._id === this.selectedCategory) : true) &&
          (this.searchQuery ? box.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
        );
      },
      (error) => {
        console.error('Error filtering boxes:', error);
        this.isLoading = false;
      }
    );
  }
}
