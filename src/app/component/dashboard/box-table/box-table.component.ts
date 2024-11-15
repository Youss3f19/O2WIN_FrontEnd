import { Component, inject } from '@angular/core';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-box-table',
  standalone: true,
  imports: [NgClass,RouterLink],
  templateUrl: './box-table.component.html',
  styleUrl: './box-table.component.css'
})
export class BoxTableComponent {
  private readonly boxService:BoxesService = inject(BoxesService);
  boxes: Box[] = [];

  constructor() {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.boxService.getBoxes().subscribe(
      (boxes) => {
        console.log(boxes);
        
        this.boxes = boxes;
    });
  }
  
  deleteBox(boxId: string): void {
    this.boxService.deleteBox(boxId).subscribe(
      () => {
        console.log('Box deleted successfully');
        this.boxes = this.boxes.filter(product => product._id !== boxId);

      },
      (error) => {
        console.error('Error deleting box:', error);
      }
    );
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }

}
