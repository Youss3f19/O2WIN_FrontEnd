import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem('authToken');
  if (token) {
    return true;
  } else {
    router.navigate(['/main/auth/login']);
    return false;
  }
};
