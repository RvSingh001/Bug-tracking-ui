import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { UserComponent } from '../user/user.component';
import { User } from 'src/app/shared/user';
import { UserService } from '../service/userservice';
import { NotificationService } from 'src/app/proejcts/service/notification-service';
import { AuthServiceService } from 'src/app/auth/auth-service.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  users: MatTableDataSource<any>;
  displayedColumns: string[] = ['FirstName', 'LastName', 'Role', 'Active'];
  isLoading: boolean = false;
  sortedData: User[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  searchKey: string = '';
  isToggleChecked: boolean | undefined;
  userRole: string | undefined;
  constructor(
    private userService: UserService,
    private dailog: MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    private authservice: AuthServiceService
  ) {
    this.users = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.userRole = this.authservice.getRoleFromLocalStrorage();
    if (!this.authservice.isAdmin(this.userRole)) {
      this.router.navigateByUrl('');
    }
    this.userService.getAllUsers().subscribe((data) => {
      this.users = new MatTableDataSource(data);
      this.isLoading = true;
      this.users.paginator = this.paginator;
    });

    console.log(this.users);
  }
  
  sortData(sort: Sort) {
    const data = this.users.data.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'FirstName':
          return compare(a.firstName, b.firstName, isAsc);
        case 'LastName':
          return compare(a.lastName, b.lastName, isAsc);
        case 'Role':
          return compare(a.role, b.role, isAsc);
        case 'Active':
          return compare(a.active, b.active, isAsc);
        default:
          return 0;
      }
    });
    this.users.data = this.sortedData;
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  changed(param: User) {
    console.log('In UserListComponent changed');
    console.log(param);
  }

  applyFilter() {
    this.users.filter = this.searchKey.trim().toLowerCase();
  }
  onCreateUser() {
    this.userService.initializeFormGroupUser();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.disableClose = true;
    dialogConfig.backdropClass = 'bdrop';
    this.dailog.open(UserComponent, dialogConfig);
  }

  onEdit(param: User) {
    console.log('In ProjectListComponent onEdit');
    console.log(param);
    this.userService.getUserById(param.userId).subscribe((data) => {
      console.log(data);
      this.userService.initializeFormGroupUser(data);
      console.log(this.userService.newUserForm.value);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '60%';
      dialogConfig.disableClose = true;
      dialogConfig.backdropClass = 'bdrop';
      this.dailog.open(UserComponent, dialogConfig);
    });
  }
  onDelete(param: User) {
    console.log('In ProjectListComponent onDelete');
    console.log(param);
    if (confirm('Are you sure want to delete this project?')) {
      this.userService.deleteUser(param.userId).subscribe((response) => {
        if (response.operationStatus === 'SUCCESS') {
          this.notificationService.success('::Deleted sucessfully');
          this.reload();
        } else {
          this.notificationService.warn('::Unable to delete');
          this.reload();
        }
      });
    }
  }
  onActive(event: any, param: User) {
    console.log(event);
    if (param.role === 'Root_ADMIN') {
      this.notificationService.warn(':: Admins are not deactived');
      return;
    }
    console.log('In ProjectListComponent onActive');
    console.log(param);
    let value = param.active;
    let dailogMgs = 'Are you sure want to active this user?';
    if (value) {
      dailogMgs = 'Are you sure want to deactive this user?';
    }
    if (confirm(dailogMgs)) {
      this.userService.activetedUser(param.userId).subscribe((response) => {
        if (response.operationStatus === 'SUCCESS') {
          this.notificationService.success('::Operation succeed');
          this.reload();
        } else {
          this.notificationService.warn(':: Operation failed');
          this.reload();
        }
      });
    } else {
      event.source.checked = value;
    }
  }
  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/users']);
    });
  }
  isAdmin(userRole: string): boolean {
    return this.authservice.isAdmin(userRole || '{}');
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
