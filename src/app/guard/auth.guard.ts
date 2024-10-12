import { CanActivateFn, Router } from '@angular/router';
import { Inject,inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const localData = localStorage.getItem("std");
  if(localData!=null){
    return true;
  }else{
    router.navigate(['/login']);
  }
  return true;
};
