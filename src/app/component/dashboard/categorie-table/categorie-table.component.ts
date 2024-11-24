import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorie-table',
  standalone: true,
  imports: [RouterLink , FormsModule],
  templateUrl: './categorie-table.component.html',
  styleUrl: './categorie-table.component.css',
})
export class CategorieTableComponent implements OnInit {
  private readonly categorieService: CategoryService = inject(CategoryService);

  categories: Category[] = [];
  filteredCategories: Category[] = [];

  nameFilter: string = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getCategorys().subscribe((categories) => {
      this.categories = categories;
      this.applyFilters(); 
    });
  }

  applyFilters(): void {
    this.filteredCategories = this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(this.nameFilter.toLowerCase())
    );
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

}
