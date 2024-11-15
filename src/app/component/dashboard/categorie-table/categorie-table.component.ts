import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categorie-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categorie-table.component.html',
  styleUrl: './categorie-table.component.css'
})
export class CategorieTableComponent implements OnInit  {
 
  private readonly categorieService:CategoryService = inject(CategoryService);
  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getCategorys().subscribe(
      (categories) => {
        console.log(categories);
        this.categories = categories;
      }
    );
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }



 


}
