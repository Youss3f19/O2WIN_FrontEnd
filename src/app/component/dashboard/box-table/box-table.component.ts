import { Component, inject } from '@angular/core';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-box-table',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './box-table.component.html',
  styleUrl: './box-table.component.css',
})
export class BoxTableComponent {
  private readonly boxService: BoxesService = inject(BoxesService);
  boxes: Box[] = [];
  isLoading: boolean = false; // Loading state

  constructor() {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.isLoading = true; // Show loader
    this.boxService.getBoxes().subscribe(
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

  deleteBox(boxId: string): void {
    this.isLoading = true; // Show loader during deletion
    this.boxService.deleteBox(boxId).subscribe(
      () => {
        console.log('Box deleted successfully');
        this.boxes = this.boxes.filter((box) => box._id !== boxId);
        this.isLoading = false; // Hide loader after deletion
      },
      (error) => {
        console.error('Error deleting box:', error);
        this.isLoading = false; // Hide loader on error
      }
    );
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
