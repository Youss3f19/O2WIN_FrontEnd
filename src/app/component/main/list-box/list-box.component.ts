import { Component } from '@angular/core';
import { BoxComponent } from "../box/box.component";

@Component({
  selector: 'app-list-box',
  standalone: true,
  imports: [BoxComponent],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.css'
})
export class ListBoxComponent {
  x:Number []  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  
}
