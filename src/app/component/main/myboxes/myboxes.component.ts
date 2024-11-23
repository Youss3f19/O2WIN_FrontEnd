import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { BoxComponent } from "../box/box.component";
import { BoxesService } from '../../../services/boxes.service';
import { HttpHeaders } from '@angular/common/http';
import { OpenBoxComponent } from "./open-box/open-box.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-myboxes',
  standalone: true,
  imports: [OpenBoxComponent, RouterLink],
  templateUrl: './myboxes.component.html',
  styleUrl: './myboxes.component.css'
})
export class MyboxesComponent {
  private readonly userService: UsersService = inject(UsersService);
  private readonly boxService: BoxesService = inject(BoxesService);

  currentUser: User | null = null;
  boxes : any[] = [];
  products: any[] = [];
  selectedBox: any = null; 
  open: boolean = false;


  ngOnInit(): void {
    this.userService.checkUserValidity();
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
      this.boxes = this.currentUser?.boxes.filter((box) => box.opened == false) || [];
      
      console.log('Current User:', this.currentUser);
    });
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  openBox(boxId: string): void {
    const header = this.getHeaders();
    this.boxService.openBox(boxId , header).subscribe(
        (response) => {
            console.log('Box opened:', response);
            this.products = response.generatedProducts
            this.boxes = this.boxes.map((box) => 
                box.box._id === boxId ? { ...box, opened: true } : box
            );
            this.userService.checkUserValidity();
            this.open = true;


        },
        (err) => console.error('Error opening box:', err),
    );
}
  closeBox(){
    this.open = false;
    this.products = [];

  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
