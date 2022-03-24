import { Injectable } from '@angular/core';
import { UserLocalStorage } from '../shared/UserLocalStorage';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  UserRole: any;

  constructor() { }

  getAuthStatus() {
    console.log('In getAuthStatus');
    let token = this.getTokenFromLocalStrorage();
    if (token != null && token.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  getTokenFromLocalStrorage(): string {
    let user = localStorage.getItem('dataSource');
    let localResponse: UserLocalStorage = JSON.parse(user || '{}');
    return localResponse.token
  }

  getUserFromLocalStorage(){
    let user = localStorage.getItem('dataSource');
    let localResponse: UserLocalStorage = JSON.parse(user || '{}');
    return localResponse;
  }

  getUserNameFromLocalStorage(): string{
    let user = localStorage.getItem('dataSource');
    let localResponse: UserLocalStorage = JSON.parse(user || '{}');
    return localResponse.UserName;
  }

  getRoleFromLocalStrorage(): string {
    let user = localStorage.getItem('dataSource');
    let localResponse: UserLocalStorage = JSON.parse(user || '{}');
    return localResponse.UserRole
  }
  
  isAdmin(userRole: string) {
    return userRole == 'ADMIN';
  }

  isDev(userRole: string) {
    return userRole == 'DEVELOPER';
  }

}
