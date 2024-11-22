import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { UsersService } from '../../../services/users.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-detailproduit',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './detailproduit.component.html',
  styleUrl: './detailproduit.component.css'
})
export class DetailproduitComponent {
  private readonly boxService : BoxesService = inject(BoxesService);
  private readonly usersService: UsersService = inject(UsersService);
  route : ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);


  box? :  Box;
  isLoading: boolean = true; 
  error: string | null = null; 

  ngOnInit(): void {
    let boxId = this.route.snapshot.params["id"];
    if (boxId) {
      this.boxService.getBoxById(boxId).subscribe({
        next: (box) => {
          this.box = box;
          this.isLoading = false;
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
