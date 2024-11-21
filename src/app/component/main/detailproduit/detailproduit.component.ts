import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';

@Component({
  selector: 'app-detailproduit',
  standalone: true,
  imports: [],
  templateUrl: './detailproduit.component.html',
  styleUrl: './detailproduit.component.css'
})
export class DetailproduitComponent {
  private readonly boxService : BoxesService = inject(BoxesService);
  route : ActivatedRoute = inject(ActivatedRoute);

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

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
