import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  isLoading: boolean = false; 
}
