import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {
  private readonly router: Router = inject(Router);
  onPurchase(){
    const token = localStorage.getItem('authToken');
    if (token){
      // Purchase logic here
      console.log('Purchased');
    }else{
      this.router.navigate(['/main/auth/login']);
    }
  }
}
