import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { User } from "src/app/shared/user";
import { NotificationService } from '../../proejcts/service/notification-service';
import { UserService } from '../service/userservice';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  newUserForm: FormGroup = this.userService.newUserForm;
  userRole = ['ADMIN', 'DEVELOPER', 'QA'];

  constructor(private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private dailogRef: MatDialogRef<UserComponent>) { }

  ngOnInit(): void {
    console.log()
  }

  onSubmitUser() {
    console.log('In UserComponent OnSubmit');
    if (this.newUserForm.valid) {
        console.log('In UserComponent OnSubmit if block');
        console.log(this.newUserForm.value);
        this.createUser(this.newUserForm.value);
    }
  }
  
  createUser(user: User) {
    console.log(`In UserComponent createuser`);
    this.userService.insertUser(user).subscribe(data => {
      this.notificationService.success('::Submitted successfully');
      this.closeDailoguser();
      this.reload();
    }, error=>{
      this.notificationService.warn('Email already exist');
    });
  }

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
