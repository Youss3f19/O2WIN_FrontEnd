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
import { Box } from '../../../models/box';

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
  boxByIdRarityProbabilities!: rarityProbabilities[];
  categories: Category[] = [];
  rarities: Rarity[] = [];
  selectedImage: File | null = null;
  loading: boolean = true;
  loadingCategories: boolean = true;
  boxCategories:Category[]=[]
  restCategories!:Category[];
  action:string = 'ADD'
  


  // onInit
  ngOnInit(): void {
    this.boxId = this.activatedRoute.snapshot.params['id'];

    // Initialize boxForm
    this.boxForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Z][A-Za-z ]+'), Validators.maxLength(25)]],
      price: ['', [Validators.required, Validators.min(1)]],
      productLimit: [1, Validators.required],
      rarityProbabilities: this.fb.array([], { validators: this.probabilitySumValidator }),
      category: this.fb.array([])
    });
    this.loading = true;
    if (this.boxId) {
      this.boxService.getBoxById(this.boxId).subscribe( 
        (box) => {
          console.log(box);
          this.boxCategories = box.categories;
          
          
          this.boxByIdRarityProbabilities = box.rarityProbabilities;
          console.log(this.boxByIdRarityProbabilities);
          
          this.boxForm.patchValue(box);
          this.selectedImage = null;  
          this.loading = false;  
          this.action = 'UPDATE'
          this.getAllCategories();
          this.getAllRarity();

        },
        (error) => {
          console.error('Error retrieving box', error)
          this.loading = false;
        }
      );
    }else{
      this.loading = false; 
      this.getAllCategories();
      this.getAllRarity();
    }

    this.initializeRarity();
    

  }

  // Get All categories and rarity
  getAllCategories(): void {
    this.categoryService.getCategorys().subscribe(
      (categories) => {
        this.categories = categories;
        console.log(categories);
        if (this.boxId) {
          this.restCategories = this.categories.filter(c =>!this.boxCategories.some(bc => bc._id === c._id));
          console.log(this.restCategories);
        }else{
          this.restCategories = this.categories;
        }

        this.loadingCategories = false;

      },
      (error) => {
        console.error('Error retrieving categories', error) 
        this.loadingCategories = false;

      }
    );
  }
  // Méthode pour ajouter une catégorie à boxCategories et la retirer de restCategories
addCategoryToBox(category: Category): void {
  // Ajoute la catégorie à boxCategories
  this.boxCategories.push(category);

  // Retire la catégorie de restCategories
  this.restCategories = this.restCategories.filter(cat => cat._id !== category._id);
}

// Méthode pour retirer une catégorie de boxCategories et la remettre dans restCategories
removeCategoryFromBox(category: Category): void {
  // Ajoute la catégorie à restCategories
  this.restCategories.push(category);

  // Retire la catégorie de boxCategories
  this.boxCategories = this.boxCategories.filter(cat => cat._id !== category._id);
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
  
    // Utiliser les catégories sélectionnées via boxCategories
    const selectedCategories: string[] = this.boxCategories.map(cat => cat._id);
    if (selectedCategories.length < 1 ) {
      this.loading = false;
      alert('Veuillez sélectionner au moins une catégorie');
      return;
    }
  
    // Préparer les probabilités de rareté
    const rarityData = this.rarityProbabilities.controls.map(control => ({
      rarity: control.value.rarity._id,
      probability: control.value.probability
    }));
  
    // Préparer le formulaire pour l'envoi
    const formData = new FormData();
    formData.append('name', this.boxForm.value.name);
    formData.append('price', this.boxForm.value.price);
    formData.append('productLimit', this.boxForm.value.productLimit);
    formData.append('rarityProbabilities', JSON.stringify(rarityData));
    formData.append('categories', JSON.stringify(selectedCategories));
  
    // Ajouter le fichier image uniquement s'il est sélectionné
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }
  
    // Appel à l'API pour ajouter ou mettre à jour la box
    if (this.boxId) {
      this.boxService.updateBox(this.boxId, formData).subscribe(
        (response) => {
          console.log('Box updated successfully', response);
          this.loading = false;
        },
        (error) => {
          console.error('Error updating box', error);
          this.loading = false;
        }
      );
    } else {
      this.boxService.addBox(formData).subscribe(
        (response) => {
          console.log('Box added successfully', response);
          this.loading = false;
        },
        (error) => {
          console.error('Error adding box', error);
          this.loading = false;
        }
      );
    }
  }
  
  
}
