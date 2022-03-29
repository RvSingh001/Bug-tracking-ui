import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth/auth-service.service';
import { NotificationService } from '../proejcts/service/notification-service';
import { UserLocalStorage } from '../shared/UserLocalStorage';
import { LoginService } from './login.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})

export class LogInComponent implements OnInit {

  public loginForm = this.loginService.loginForm;
  loading: boolean = false;
  loginResponse: UserLocalStorage | undefined;
  hide = true;

  constructor(private loginService: LoginService, private router: ActivatedRoute, private route: Router, private authService: AuthServiceService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authService.getAuthStatus()) {
      this.route.navigateByUrl('/projects')
    }
    this.loginService.onDataReceived(false);
  }

  login() {
    this.loading = true;
    if (this.loginForm.valid)
      this.loginService.loginUser(this.loginForm.value)
        .subscribe(
          (response: any) => {
            this.loading = false;
            console.log(response.headers.keys());
            console.log(response.headers.valueOf());
            console.log(response.headers.valueOf().headers.get("authorization"));
            this.loginResponse = new UserLocalStorage();
            this.loginResponse.UserId = response.headers.valueOf().headers.get("userid")[0];
            this.loginResponse.UserName = response.headers.valueOf().headers.get("username")[0];
            this.loginResponse.UserEmail = response.headers.valueOf().headers.get("useremail")[0];
            this.loginResponse.UserRole = response.headers.valueOf().headers.get("userrole")[0];
            this.loginResponse.token = response.headers.valueOf().headers.get("authorization")[0];
            localStorage.setItem('dataSource', JSON.stringify(this.loginResponse));
            console.log(this.loginResponse);
            this.loginService.onDataReceived(true);
            this.route.navigateByUrl('/projects')
          },
          error => {
            console.log('in Error login');
            this.notificationService.warn(error);
            console.log(error);
            this.loading = false;
          });
  }
}

