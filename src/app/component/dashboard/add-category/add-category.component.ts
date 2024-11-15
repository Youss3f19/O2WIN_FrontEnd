import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {

  private readonly categorieService: CategoryService = inject(CategoryService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  categoryForm!: FormGroup;
  categoryId!: string;
  selectedImage: File | null = null;

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.params['id'];

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z][A-Za-z 0-9]+'), Validators.maxLength(20)]],
      description: ['', Validators.maxLength(500)],
    });

    if (this.categoryId) {
      this.categorieService.getCategoryById(this.categoryId).subscribe(
        (category) => {
          console.log(category);
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description,
          });
        }
      );
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedImage = file ? file : null;
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = new FormData();  // Using FormData for file uploads
  
      // Append form values to FormData
      categoryData.append('name', this.categoryForm.value.name);
      categoryData.append('description', this.categoryForm.value.description);
  
      // Append selected image if available
      if (this.selectedImage) {
        categoryData.append('file', this.selectedImage, this.selectedImage.name);
      }
  
      // If categoryId exists, update category, else create new category
      if (this.categoryId) {
        // Update category
        this.categorieService.updateCategory(this.categoryId, categoryData).subscribe(
          () => {
            console.log('Category updated successfully');
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
      } else {
        // Add new category
        this.categorieService.addCategory(categoryData).subscribe(
          () => {
            console.log('Category added successfully');
          },
          (error) => {
            console.error('Error adding category:', error);
          }
        );
      }
    } else {
      console.error('Form is invalid');
    }
  }
  
}
