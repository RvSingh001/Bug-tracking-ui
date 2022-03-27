import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';


import { ProjectComponent } from '../project/project.component';
import { Project } from 'src/app/shared/project';
import { NotificationService } from '../service/notification-service';
import { HttpService } from '../service/http-service';
import { AuthServiceService } from 'src/app/auth/auth-service.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {


  projects: MatTableDataSource<any>;
  displayedColumns: string[] = ['ProjectName', 'Type', 'Status', 'createdAt', 'actions'];
  isLoading: boolean = false;
  sortedData: Project[] = [];
  userRole: string| undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  searchKey: string = '';
  name: string="Rajveer";
  

  constructor(private projectService: HttpService,
    private dailog: MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    private authservice: AuthServiceService) {
    this.projects = new MatTableDataSource();
  }

  ngOnInit(): void {
    
     this.userRole = this.authservice.getRoleFromLocalStrorage();
    this.projectService.getAllProjects().subscribe(data => {
      this.projects = new MatTableDataSource(data);
      this.isLoading = true;
      this.projects.paginator = this.paginator;
    })
    
    this.name=this.authservice.getUserNameFromLocalStorage();
    
    console.log(this.projects);
  }

  sortData(sort: Sort) {
    const data = this.projects.data.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'ProjectName':
          return compare(a.projectName, b.projectName, isAsc);
        case 'Status':
          return compare(a.status, b.status, isAsc);
        case 'Type':
          return compare(a.type, b.type, isAsc);
        case 'createdAt':
            return compare(a.createdAt, b.createdAt, isAsc);
        default:
          return 0;
      }
    });
    this.projects.data = this.sortedData;
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.projects.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate() {
    if(!this.isAdmin()){
    return;
    }
    this.projectService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.disableClose = true;
    dialogConfig.backdropClass = "bdrop";
    this.dailog.open(ProjectComponent, dialogConfig);
  }

  onEdit(param: Project) {
    console.log('In ProjectListComponent onEdit');
    console.log(param);
    this.projectService.getProjectById(param.projectId).subscribe(data => {
      console.log(data);
      this.projectService.initializeFormGroup(data);
      console.log(this.projectService.newProjectForm.value);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '60%';
      dialogConfig.disableClose = true;
      dialogConfig.backdropClass = "bdrop";
      this.dailog.open(ProjectComponent, dialogConfig);
    });
  }
  onDelete(param: Project) {
    console.log('In ProjectListComponent onDelete');
    console.log(param);
    if (confirm('Are you sure want to delete this project?')) {
      this.projectService.deleteProject(param.projectId).subscribe(response => {
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

  showBug(params: Project) {
    console.log('In ProjectList showBug');
    this.router.navigateByUrl(`projects/${params.projectId}/bugs`);
  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/projects']);
    });
  }

  isAdmin():boolean {
    
    return this.authservice.isAdmin(this.userRole || '{}');
    
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
