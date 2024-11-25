import { Component, inject, Input} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Box } from '../../../models/box';
import { BoxesService } from '../../../services/boxes.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent {
  private readonly router: Router = inject(Router);
  private readonly boxesService: BoxesService = inject(BoxesService);
  private readonly usersService: UsersService = inject(UsersService);

  @Input() box!: Box;

  addBoxToCart(box: Box): void {
    this.usersService.currentUser$.subscribe(user => {
      if (user) {
        this.boxesService.addToPanier(box);
      } else {
        this.router.navigate(['/main/auth/login']);
      }
    });
  }



  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
