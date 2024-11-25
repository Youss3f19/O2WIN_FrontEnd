import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Box } from '../../../models/box';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink , TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private readonly userService: UsersService = inject(UsersService);
  currentUser: User | null = null;



  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
      console.log('Current User profile:', this.currentUser);
    });
  }
  

  nbOpenedBox():number{
    return this.currentUser?.boxes.filter(box => box.opened === true).length || 0;
  }

  



}
