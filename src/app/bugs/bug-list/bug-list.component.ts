import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { NotificationService } from 'src/app/proejcts/service/notification-service';
import { Bug } from 'src/app/shared/bug';
import { UserLocalStorage } from 'src/app/shared/UserLocalStorage';
import { BugComponent } from '../bug/bug.component';
import { BugService } from '../service/bug.service';

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.scss']
})
export class BugListComponent implements OnInit {

  bugs: MatTableDataSource<any>;
  displayedColumns: string[] = ['Title', 'Description', 'Status', 'createdAt', 'lastModified', 'createdBy', 'actions'];
  isLoading: boolean = false;
  sortedData: Bug[] = [];
  projectId: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  searchKey: string = '';
  private routeSub: Subscription | undefined;
  user: UserLocalStorage | undefined

  constructor(private bugService: BugService,
    private dailog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthServiceService) {
    this.bugs = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.routeSub = this.route.params.subscribe(params => {
     // console.log(params) //log the entire params object
     // console.log(params['id']) //log the value of id
      this.projectId = params['id'];
      this.bugService.getAllByProject(this.projectId).subscribe(data => {
        console.log(data);
        if(this.authService.isDev(this.user?.UserRole || '')){
          console.log('in if condition')
          data = data.filter((ele:any) => ele.userId === this.user?.UserId)
        }
        this.bugs = new MatTableDataSource(data);
        this.isLoading = true;
        this.bugs.paginator = this.paginator;
      })
      console.log(this.bugs);
    });

  }
  sortData(sort: Sort) {
    //  console.log('In BugListComponent SortData')
    const data = this.bugs.data.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }
    // console.log(sort);
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Title':
          return compare(a.title, b.title, isAsc);
        case 'Status':
          return compare(a.status, b.status, isAsc);
        case 'Priority':
          return compare(a.priority, b.priority, isAsc);
        default:
          return 0;
      }
    });
    this.bugs.data = this.sortedData;
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.bugs.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate() {
    if(this.isDeveloper()){
      return;
    }
    this.bugService.initializeFormGroup();
    this.bugService.newBugForm.patchValue({
      projectId: this.projectId
    })
    console.log(this.bugService.newBugForm.value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.disableClose = true;
    dialogConfig.backdropClass = "bdrop";
    this.dailog.open(BugComponent, dialogConfig);
  }

  onEdit(param: Bug) {
    console.log('In BugListComponent onEdit');
    console.log(param);
    this.bugService.getBugById(param.bugId).subscribe(data => {
      console.log(data);
      this.bugService.initializeFormGroup(data);
      console.log(this.bugService.newBugForm.value);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '60%';
      dialogConfig.disableClose = true;
      dialogConfig.backdropClass = "bdrop";
      this.dailog.open(BugComponent, dialogConfig);
    });
  }
  onDelete(param: Bug) {
    if(this.isDeveloper()){
      return;
    }
    console.log('In BugListComponent onDelete');
    console.log(param);
    if (confirm('Are you sure want to delete this bug?')) {
      this.bugService.deleteBug(param.bugId).subscribe(response => {
        if (response.operationStatus === 'SUCCESS') {
          this.notificationService.success('::Deleted sucessfully');
          this.reload();
        }
        else {
          this.notificationService.warn('::Unable to delete');
          this.reload();
        }
      })
    }
  }

  showBug() {
    console.log('In ProjectLisy showBug');
  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/projects/${this.projectId}/bugs`]);
    });
  }

  isDeveloper(){
    return this.user?.UserRole === "DEVELOPER";
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}



