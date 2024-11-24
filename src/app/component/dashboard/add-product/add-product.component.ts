import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { CategoryService } from '../../../services/category.service';
import { RarityService } from '../../../services/rarity.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category';
import { Rarity } from '../../../models/rarity';
import { of } from 'rxjs';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
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
  categoriesLoaded = false;
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params['id'];

    // Initialize the form with empty FormArray for category
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z][A-Za-z 0-9]+'), Validators.maxLength(25)]],
      description: ['', Validators.maxLength(500)],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: this.fb.array([], [this.minSelectedCheckboxes(1)]),
      rarity: ['', Validators.required]
    });

    // Load categories and rarities
    this.getAllCategories();
    this.getAllRarity();

    // If product ID exists, fetch product details
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe(
        (product) => {
          this.productByIdCategories = product.categories.map(c => c._id);
          this.initializeCategoryControls();
          this.productForm.patchValue(product);
          this.productForm.get('rarity')?.setValue(product.rarity._id);
          this.selectedImage = null;
        },
        (error) => console.error('Error retrieving product', error)
      );
    }
  }

  // Fetch all categories and initialize category controls
  getAllCategories(): void {
    this.categoryService.getCategorys().subscribe(
      (categories) => {
        this.categories = categories;
        if (!this.productId) {
          this.initializeCategoryControls();
        }
      },
      (error) => console.error('Error retrieving categories', error)
    );
  }

  // Fetch all rarities
  getAllRarity(): void {
    this.rarityService.getRarities().subscribe(
      (rarities) => {
        this.rarities = rarities;
      },
      (error) => console.error('Error retrieving rarities', error)
    );
  }

  // Initialize category checkboxes
  private initializeCategoryControls(): void {
    this.category.clear();

    // Emit categories as an observable
    of(this.categories).subscribe((categories) => {
      categories.forEach((category) => {
        const isSelected = this.productByIdCategories
          ? this.productByIdCategories.includes(category._id)
          : false;

        const control = this.fb.control(isSelected);
        this.category.push(control);
      });

      // Indicate that categories have been loaded
      this.categoriesLoaded = true;
    });
  }
  // Getter for category FormArray
  get category(): FormArray {
    return this.productForm.get('category') as FormArray;
  }

  // Custom validator to ensure at least one checkbox is selected
  minSelectedCheckboxes(min = 1): (control: AbstractControl) => null | object {
    return (control: AbstractControl) => {
      const selected = control.value.filter((checked: boolean) => checked).length;
      return selected >= min ? null : { minSelection: true };
    };
  }

  // Handle image file selection
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedImage = file ? file : null;
  }

  // Handle form submission for adding/updating a product
  onSubmit(): void {
    if (this.productForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    // Extract selected categories
    const selectedCategories: string[] = this.category.controls
      .map((control, index) => control.value ? this.categories[index]._id : null)
      .filter((id) => id !== null);

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('stock', this.productForm.value.stock);
    formData.append('rarity', this.productForm.value.rarity);
    formData.append('categories', JSON.stringify(selectedCategories));

    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }

    // Submit the form data
    if (this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe(
        (response) => {
          console.log('Product updated successfully', response);
          this.modalTitle = 'Product Updated';
          this.modalMessage = 'The product was updated successfully.';
          this.showModal = true;
        },
        (error) => console.error('Error updating product', error)
      );
    } else {
      this.productService.addProduct(formData).subscribe(
        (response) => {
          console.log('Product added successfully', response);
          this.modalTitle = 'Product Added';
          this.modalMessage = 'The product was added successfully.';
          this.showModal = true;
        },
        (error) => console.error('Error adding product', error)
      );
    }
  }
  closeModal(): void {
    this.showModal = false;
  }
}
