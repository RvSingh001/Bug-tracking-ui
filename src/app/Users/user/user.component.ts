import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from "src/app/shared/user";
import { NotificationService } from '../../proejcts/service/notification-service';
import { UserService } from '../service/userservice';
import { UserLocalStorage } from 'src/app/shared/UserLocalStorage';
import { AuthServiceService } from 'src/app/auth/auth-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  newUserForm: FormGroup = this.userService.newUserForm;
  userRole = ['QA', 'DEVELOPER', 'ADMIN'];
  admin = ['QA', 'DEVELOPER'];
  user: UserLocalStorage | undefined;

  constructor(private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private dailogRef: MatDialogRef<UserComponent>,
    private authservice: AuthServiceService) { }

  ngOnInit(): void {
    this.user = this.authservice.getUserFromLocalStorage();
    // this.populateUserRole(this.user.UserRole || '{}');
    console.log()
  }

  onSubmitUser() {
    if (this.newUserForm.valid) {
      if (!this.newUserForm.value.userId) {
        this.createUser(this.newUserForm.value);
      }
      else {
        this.updateUser(this.newUserForm.value);
      }
    }
  }

  createUser(user: User) {
    console.log(`In UserComponent createuser`);
    this.userService.insertUser(user).subscribe(data => {
      this.notificationService.success('Submitted successfully');
      this.closeDailoguser();
      this.reload();
    }, error => {
      this.notificationService.warn('Email already exist');
    });
  }

  updateUser(user: User) {
    console.log(`In UserComponet update user`);
    this.userService.updateUser(user).subscribe(data => {
      this.closeDailoguser();
      this.notificationService.success('Modified successfully');
      this.reload();
    });
  }

  // populateUserRole(userRole: string) {
  //   if (userRole === 'ADMIN') {
  //     this.userRole = this.admin;
  //   }
  // }

  onClearuser() {
    console.log("In UserComponent onClear")
    let userId = this.newUserForm.value.userId;
    if (userId) {
      console.log("In UserComponent onClear if block");
      this.newUserForm.reset();
      this.userService.populatePartialFormUser(userId);
    }
    else {
      console.log("In ProjectComponent onClear else block");
      this.newUserForm.reset();
      this.userService.initializeFormGroupUser();
    }
  }

  closeDailoguser() {
    this.userService.newUserForm.reset;
    this.userService.initializeFormGroupUser();
    this.dailogRef.close();
  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/users']);
    });
  }

  onCloseUser() {
    console.log('In UserComponent onClose');
    this.closeDailoguser();
  }
}
