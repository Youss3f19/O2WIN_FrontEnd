import { Component, inject, Input, OnInit } from '@angular/core';
import { BoxComponent } from "../box/box.component";
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-list-box',
  standalone: true,
  imports: [BoxComponent, LoaderComponent],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.css'
})
export class ListBoxComponent implements OnInit {
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
  
}
