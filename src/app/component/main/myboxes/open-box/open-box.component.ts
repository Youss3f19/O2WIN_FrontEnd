import { JsonPipe, NgStyle } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-open-box',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './open-box.component.html',
  styleUrl: './open-box.component.css'
})
export class OpenBoxComponent implements OnInit  {
  
  @Input() products! :any;
  reveal !: boolean[] ;
  ngOnInit(): void {
    console.log("products : " , this.products);
    this.reveal = new Array(this.products.length).fill(false);
  }

  toggleCard(event: Event): void {
    const card = event.currentTarget as HTMLElement;
    card.classList.toggle('clicked');
  }
  revealProduct(index: number): void {
    this.reveal[index] = true;
  }


  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
