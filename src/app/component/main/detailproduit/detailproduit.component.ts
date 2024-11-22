import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { UsersService } from '../../../services/users.service';
import { LoaderComponent } from '../../loader/loader.component';
import { Product } from '../../../models/product';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-detailproduit',
  standalone: true,
  imports: [RouterLink, LoaderComponent,JsonPipe],
  templateUrl: './detailproduit.component.html',
  styleUrl: './detailproduit.component.css'
})
export class DetailproduitComponent {
  private readonly boxService : BoxesService = inject(BoxesService);
  private readonly usersService: UsersService = inject(UsersService);
  route : ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);


  box? :  Box;
  products!: Product[] ;
  isLoading: boolean = true; 
  error: string | null = null; 

  ngOnInit(): void {
    let boxId = this.route.snapshot.params["id"];
    if (boxId) {
      this.boxService.getBoxById(boxId).subscribe({
        next: (box) => {
          this.box = box;
          this.getBoxByProduct(boxId);
          
        },
        error: (err) => {
          this.error = "Unable to fetch box details.";
          console.error(err);
          this.isLoading = false;
        },
      });
    } else {
      this.error = "Box ID not found.";
      this.isLoading = false;
    }
  }

  getBoxByProduct(boxId:string):void {
    this.boxService.getProductsByBox(boxId).subscribe(
      (products) => {
        console.log('Products fetched:', products);
        this.products = products;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    )
  }

  addBoxToCart(box: Box): void {
    this.usersService.currentUser$.subscribe(user => {
      if (user) {
        this.boxService.addToPanier(box);
      } else {
        this.router.navigate(['/main/auth/login']);
      }
    })
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
