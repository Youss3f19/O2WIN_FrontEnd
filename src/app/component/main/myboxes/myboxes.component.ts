import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { BoxComponent } from "../box/box.component";
import { BoxesService } from '../../../services/boxes.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-myboxes',
  standalone: true,
  imports: [],
  templateUrl: './myboxes.component.html',
  styleUrl: './myboxes.component.css'
})
export class MyboxesComponent {
  private readonly userService: UsersService = inject(UsersService);
  private readonly boxService: BoxesService = inject(BoxesService);

  currentUser: User | null = null;
  boxes : any[] = [];
  selectedBox: any = null; 


  ngOnInit(): void {
    this.userService.checkUserValidity();
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
      this.boxes = this.currentUser?.boxes || [];
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
            // Met à jour l'état local des boîtes après ouverture
            this.boxes = this.boxes.map((box) => 
                box.box._id === boxId ? { ...box, opened: true } : box
            );
            
            this.userService.checkUserValidity();
        },
        (err) => console.error('Error opening box:', err),
    );
}

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
