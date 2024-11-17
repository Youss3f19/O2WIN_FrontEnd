import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userService: UsersService = inject(UsersService);
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    router.navigate(['/main/auth/login']);
    console.log("false");
    return false;
  }

  return new Promise<boolean>((resolve, reject) => {
    userService.verifyToken(token).subscribe( 
      response => {
        if (response.isAdmin) {
          resolve(true); 
        } else {
          console.log(token);
          router.navigate(['/main/list-boxes']);
          resolve(false);
        }
      },
      error => {
        console.error("Error verifying token:", error);
        router.navigate(['/main/auth/login']);
        resolve(false);
      }
    );
  });
};
