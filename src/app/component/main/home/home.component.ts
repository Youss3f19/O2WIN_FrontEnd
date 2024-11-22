import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly boxesService : BoxesService= inject(BoxesService);
  boxes: Box[] = [];
  isLoading: boolean = false; 
  

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.isLoading = true; // Show loader
    this.boxesService.getBoxes().subscribe(
      (boxes) => {
        console.log(boxes);
        this.boxes = boxes;
        this.isLoading = false; // Hide loader
      },
      (error) => {
        console.error('Error loading boxes:', error);
        this.isLoading = false; // Hide loader on error
      }
    );
  }
  
  getThreeBoxes(i:number):Box[]{
    return this.boxes.slice(i, i + 3);
    
  }
  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
