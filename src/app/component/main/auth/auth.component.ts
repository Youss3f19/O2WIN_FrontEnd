import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  
}
