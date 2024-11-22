import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { BoxesService } from '../../../services/boxes.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { rarityProbabilities } from '../../../models/rarity-probability';
import { RarityService } from '../../../services/rarity.service';
import { Rarity } from '../../../models/rarity';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { LoaderComponent } from "../../loader/loader.component";
import { of } from 'rxjs';

@Component({
  selector: 'app-add-box',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LoaderComponent],
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.css']
})
export class AddBoxComponent implements OnInit {
  private readonly boxService: BoxesService = inject(BoxesService);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly rarityService: RarityService = inject(RarityService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute); 
  private readonly fb: FormBuilder = inject(FormBuilder);
  
  
  
  boxForm!: FormGroup;
  boxId!: string;
  boxByIdCategories!: any[];
  boxByIdRarityProbabilities!: rarityProbabilities[];
  categories: Category[] = [];
  rarities: Rarity[] = [];
  selectedImage: File | null = null;
  loading: boolean = true;
  loadingCategories: boolean = true;


  // onInit
  ngOnInit(): void {
    this.boxId = this.activatedRoute.snapshot.params['id'];

    // Initialize boxForm
    this.boxForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Z][A-Za-z ]+'), Validators.maxLength(25)]],
      price: ['', [Validators.required, Validators.min(1)]],
      productLimit: ['', Validators.required],
      rarityProbabilities: this.fb.array([], { validators: this.probabilitySumValidator }),
      category: this.fb.array([])
    });
    this.loading = true;
    if (this.boxId) {
      this.boxService.getBoxById(this.boxId).subscribe(
        (box) => {
          console.log(box);
          
          this.boxByIdCategories = box.categories;
          console.log(this.boxByIdCategories);

          this.boxByIdRarityProbabilities = box.rarityProbabilities;
          console.log(this.boxByIdRarityProbabilities);
          
          this.boxForm.patchValue(box);
          this.selectedImage = null;  
          this.loading = false;  
        },
        (error) => {
          console.error('Error retrieving box', error)
          this.loading = false;
        }
      );
    }
    this.initializeCategoryControls();
    this.initializeRarity();

    this.getAllCategories();
    this.getAllRarity();
  }

  // Get All categories and rarity
  getAllCategories(): void {
    this.categoryService.getCategorys().subscribe(
      (categories) => {
        this.categories = categories;
        this.initializeCategoryControls();  // Initialize checkbox controls for categories
        this.loadingCategories = false;
      },
      (error) => {
        console.error('Error retrieving categories', error) 
        this.loadingCategories = false;

      }
    );
  }

  getAllRarity(): void {
    this.rarityService.getRarities().subscribe(
      (rarities) => {
        this.rarities = rarities;
        this.initializeRarity();  // Initialize rarity form groups
      },
      (error) => console.error('Error retrieving rarity probabilities', error)
    );
  }

  // Initialize category form controls
  private initializeCategoryControls(): void {
    // Emit the categories array as an observable
    of(this.categories).subscribe((categories) => {
      categories.forEach((category) => {
        const isSelected = this.boxByIdCategories
          ? this.boxByIdCategories.includes(category._id)
          : false;
        console.log(category._id);
        console.log(isSelected);
  
        this.category.push(this.fb.control(isSelected));
      });
    });
  }
  
  private initializeRarity(): void {
    // Emit the rarities array as an observable
    of(this.rarities).subscribe((rarities) => {
      rarities.forEach((rarity, index) => {
        this.rarityProbabilities.push(
          this.fb.group({
            rarity: rarity,
            probability: [
              this.boxByIdRarityProbabilities
                ? this.boxByIdRarityProbabilities[index].probability
                : 100 / this.rarities.length,
              Validators.required,
            ],
          })
        );
      });
    });
  }
  // Custom validator to ensure total probability sums to 100
  probabilitySumValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    const totalProbability = formArray.controls.reduce((sum, group) => {
      const probability = group.get('probability')?.value;
      return sum + (probability || 0);
    }, 0);

    return totalProbability === 100 ? null : { probabilitySum: true };
  }

  // Getters for form controls
  get rarityProbabilities(): FormArray {
    return this.boxForm.get('rarityProbabilities') as FormArray;
  }
  
  get category(): FormArray {
    return this.boxForm.get('category') as FormArray;
  }

  // Handle file change for image picker
  onFileChange(event: any): void {
    const file = event.target.files[0]; 
    this.selectedImage = file ? file : null;
  }

  // Submit the form to add or update a box
  onSubmit(): void {
    this.loading = true;
    const selectedCategories: string[] = this.category.controls
      .map((control, index) => control.value ? this.categories[index]._id : null)
      .filter((id) => id !== null);
  
    const rarityData = this.rarityProbabilities.controls.map(control => ({
      rarity: control.value.rarity._id,
      probability: control.value.probability
    }));
  
    const formData = new FormData();
    formData.append('name', this.boxForm.value.name);
    formData.append('price', this.boxForm.value.price);
    formData.append('productLimit', this.boxForm.value.productLimit);
    formData.append('rarityProbabilities', JSON.stringify(rarityData));
    formData.append('categories', JSON.stringify(selectedCategories));
  
    // Append the file only if a new one was selected
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }
  
    // Perform update if boxId exists, otherwise, add a new box
    if (this.boxId) {
      this.boxService.updateBox(this.boxId, formData).subscribe(
        (response ) => {
          console.log('Box updated successfully', response)
          this.loading = false;

        },
        (error) =>{ 
          console.error('Error updating box', error)
          this.loading = false;
        }
      );
    } else {
      this.boxService.addBox(formData).subscribe(
        (response) => {
          console.log('Box added successfully', response)
          this.loading = false;
        },
        (error) =>{ 
          this.loading = false;
          console.error('Error adding box', error)
        }
      );
    }
  }
  
}
