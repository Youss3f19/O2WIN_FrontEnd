import { Component, inject, Input} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Box } from '../../../models/box';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {
  private readonly router: Router = inject(Router);
  @Input() box! :Box;
  onPurchase(){
    const token = localStorage.getItem('authToken');
    if (token){
      // Purchase logic here
      console.log('Purchased');
    }else{
      this.router.navigate(['/main/auth/login']);
    }
  }

  
  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
