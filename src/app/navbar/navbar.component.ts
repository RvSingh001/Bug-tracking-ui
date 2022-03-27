import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { LoginService } from 'src/app/log-in/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  loginSubs: Subscription | undefined;
  constructor(private authService: AuthServiceService, private route: Router, private loginService : LoginService) { }
  ngOnDestroy(): void {
    this.loginSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.loginSubs = this.loginService.dataObsevable.subscribe(data => {
      console.log('NavbarComponent on ngOnInit');
      console.log(data);
      this.isLoggedIn = data;
    })
  }

  logout(){
    console.log('In navbar logout');
    localStorage.removeItem('dataSource');
    this.route.navigateByUrl('');
    this.loginService.onDataReceived(false);
  }


}
