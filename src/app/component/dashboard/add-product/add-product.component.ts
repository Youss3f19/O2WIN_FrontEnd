import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { CategoryService } from '../../../services/category.service';
import { RarityService } from '../../../services/rarity.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category';
import { Rarity } from '../../../models/rarity';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  
  private readonly productService: ProductsService = inject(ProductsService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly rarityService: RarityService = inject(RarityService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  productForm!: FormGroup;
  categories: Category[] = [];
  rarities: Rarity[] = [];
  productId!: string;
  productByIdCategories!: any[];
  selectedImage: File | null = null;

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params['id'];

    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z][A-Za-z 0-9]+'), Validators.maxLength(25)]],
      description: ['', Validators.maxLength(500)],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: this.fb.array([], this.minSelectedCheckboxes(1)),
      rarity: ['', Validators.required]
    });

    // Fetch the categories and rarities

    if (this.productId) {
      // Fetch the product by ID for updating
      this.productService.getProductById(this.productId).subscribe(
        (product) => {
          console.log(product);
          this.productByIdCategories = product.categories.map(c => c._id);
          console.log(this.productByIdCategories);
          
          this.productForm.patchValue(product);
         this.productForm.get('rarity')?.setValue(product.rarity._id);

          this.selectedImage = null;
        },
        (error) => console.error('Error retrieving product', error)
      );
    }

    this.initializeCategoryControls();  

    this.getAllCategories();
    this.getAllRarity();


  }

  // Get categories and rarities
  getAllCategories(): void {
    this.categoryService.getCategorys().subscribe(
      (categories) => {
        this.categories = categories;
        this.initializeCategoryControls();
      },
      (error) => console.error('Error retrieving categories', error)
    );
  }

  getAllRarity(): void {
    this.rarityService.getRarities().subscribe(
      (rarities) => {
        this.rarities = rarities;
      },
      (error) => console.error('Error retrieving rarities', error)
    );
  }

  // Initialize category checkboxes based on existing categories for the product
  private initializeCategoryControls(): void {
    this.categories.forEach((category, index) => {
      const isSelected = this.productByIdCategories ? this.productByIdCategories.includes(category._id) : false;
      console.log(isSelected);
      
    
      this.category.push(this.fb.control(isSelected));
    });
  }

  // Get category form array
  get category(): FormArray {
    return this.productForm.get('category') as FormArray;
  }

  // Ensure at least one category is selected
  minSelectedCheckboxes(min = 1): (control: AbstractControl) => null | object {
    return (control: AbstractControl) => {
      const selected = control.value.filter((checked: boolean) => checked).length;
      return selected >= min ? null : { minSelection: true };
    };
  }

  // Handle file selection for image
  onFileChange(event: any): void {
    const file = event.target.files[0]; 
    this.selectedImage = file ? file : null;
  }

  // Handle form submission for both adding and updating a product
  onSubmit(): void {
    if (this.productForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    // Extract selected categories
    const selectedCategories: string[] = this.category.controls
      .map((control, index) => control.value ? this.categories[index]._id : null)
      .filter((id) => id !== null);

    // Create FormData to send
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('stock', this.productForm.value.stock);
    formData.append('rarity', this.productForm.value.rarity);
    formData.append('categories', JSON.stringify(selectedCategories));

    // Append the image if selected
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }

    // Call the appropriate service method to add or update the product
    if (this.productId) {
      this.productService.updatteredProduct(this.productId, formData).subscribe(
        (response) => console.log('Product updated successfully', response),
        (error) => console.error('Error updating product', error)
      );
    } else {
      this.productService.addProduct(formData).subscribe(
        (response) => console.log('Product added successfully', response),
        (error) => console.error('Error adding product', error)
      );
    }
  }
}
