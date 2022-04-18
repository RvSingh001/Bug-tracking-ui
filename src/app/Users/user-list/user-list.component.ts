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
import { Project } from 'src/app/shared/project';
import { UserLocalStorage } from 'src/app/shared/UserLocalStorage';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})

export class UserListComponent implements OnInit {

  users: MatTableDataSource<any>;
  displayedColumns: string[] = ['FirstName', 'LastName', 'Email', 'Creation Time', 'Role', 'Active', 'action'];
  isLoading: boolean = false;
  sortedData: User[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  searchKey: string = '';
  isToggleChecked: boolean | undefined;
  userRole: string | undefined;
  name: string | undefined;
  user: UserLocalStorage|undefined
  admin = "ADMIN";
  superAdmin = "SUPER_ADMIN";
  qa="QA";
  developer="DEVELOPER";

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

      // if(this.authservice.isAdminDiff(this.userRole || ''))
      // {
      //   data = data.filter((ele: any) => ele.role == this.qa || ele.role == this.developer)
      // }
      
      this.users = new MatTableDataSource(data);
      this.isLoading = true;
      this.users.paginator = this.paginator;
    });
    this.name = this.authservice.getUserNameFromLocalStorage();
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
        case 'Email':
          return compare(a.email, b.email, isAsc);
        case 'Creation Time':
          return compare(a.createdAt, b.createdAt, isAsc);
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

  //Edit Function
  onEdit(param: User) {

    // if (param.role == this.superAdmin) {
    //   this.notificationService.warn("Super admin can not be updated");
    //   return;
    // }

    // if (param.email == this.authservice.getUserFromLocalStorage().UserEmail) {

    //   this.notificationService.warn("Please contact super admin for updation");
    //   return;
    // }

    // if (param.role != this.admin || this.userRole == this.superAdmin) {
      // if (param.role != this.admin) {
      this.userService.getUserById(param.userId).subscribe((data) => {
        this.userService.initializeFormGroupUser(data);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = '60%';
        dialogConfig.disableClose = true;
        dialogConfig.backdropClass = 'bdrop';
        this.dailog.open(UserComponent, dialogConfig);
      });
      this.reload()
      return;
    // }
    // else {
    //   this.notificationService.warn("Can not edit other admin details")
    //   return;
    // }
  }

  // #Delete function
  onDelete(param: User) {

    // if (param.role == this.superAdmin) {
    //   this.notificationService.warn("Super admin can not be deleted");
    //   return;
    // }

    // if (param.email == this.authservice.getUserFromLocalStorage().UserEmail) {
    //   this.notificationService.warn("Please contact super admin for account deletion");
    //   return;

    // }
    // if (param.role != this.admin || this.userRole == this.superAdmin) {
      
      if (confirm('Are you sure want to delete this user?')) {
        this.userService.deleteUser(param.userId).subscribe((response) => {
          if (response.operationStatus === 'SUCCESS') {
            this.notificationService.success('Deleted sucessfully');
            this.reload();
           } 
          else {
            this.notificationService.warn('Unable to delete');
            return;
          }
        });
   //   }
    }
    // else {
    //   this.notificationService.warn("Can not delete other admin")
    //   return;
    // }
  }

  //Active Function
  onActive(event: any, param: User) {

    // if (param.role == this.superAdmin) {
    //   this.notificationService.warn("Super admin can not be deactivated");
    //   this.reload();
    //   return;
    // }

    // if (param.email == this.authservice.getUserFromLocalStorage().UserEmail) {
    //   this.notificationService.warn("Please contact super admin for account deactivation");
    //   this.reload();
    //   return;
    // }
    // if (param.role != this.admin || this.userRole == this.superAdmin) {
      let value = param.active;
      let dailogMgs = 'Are you sure want to active this user?';
      if (value) {
        dailogMgs = 'Are you sure want to deactive this user?';
      }
      if (confirm(dailogMgs)) {
        this.userService.activetedUser(param.userId).subscribe((response) => {
          if (response.operationStatus === 'SUCCESS') {
            this.notificationService.success('Operation succeed');
            this.reload();
          } else {
            this.notificationService.warn('Operation failed');
            this.reload();
            return;
          }
        });
      } else {
        event.source.checked = value;
      }
    // }
    // else {
    //   this.notificationService.warn(":: Can not deactivated other admin")
    //   this.reload();
    //   return;
    // }

  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/users']);
    });
  }

  isAdmin(userRole: string): boolean {
    return this.authservice.isAdmin(userRole || '{}');
    //return false
  }

  isActive(userActive : boolean):boolean
{
  return  userActive==true;
}
}




function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
