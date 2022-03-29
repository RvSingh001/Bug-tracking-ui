import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './auth/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthServiceService,
    private route: Router) {
  }
  ngOnInit(): void {
    let token = this.authService.getTokenFromLocalStrorage();
    if (!token) {
      this.route.navigateByUrl('');
    }
  }
}
