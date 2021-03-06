import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { HttpService } from 'src/app/proejcts/service/project-service';
import { NotificationService } from 'src/app/proejcts/service/notification-service';
import { Bug } from 'src/app/shared/bug';
import { Project } from 'src/app/shared/project';
import { User } from 'src/app/shared/user';
import { UserLocalStorage } from 'src/app/shared/UserLocalStorage';
import { UserService } from 'src/app/Users/service/userservice';
import { BugService } from '../service/bug.service';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.scss']
})

export class BugComponent implements OnInit {
  newBugForm: FormGroup = this.bugService.newBugForm;
  bugStatus = ['NOT_AN_ISSUE', 'IN_PROGRESS', 'FIX', 'OPEN', 'CLOSE'];
  qaBugStatus = ['OPEN'];
  qaBugStatusModify=['OPEN','REOPEN','CLOSE'];
  devStatus = ['NOT_AN_ISSUE', 'IN_PROGRESS', 'FIX'];
  bugPriority = ['LOW', 'MEDIUM', 'HIGH'];
  project: Project = new Project();
  user: UserLocalStorage | undefined;
  devUsers: User[] = [];

  constructor(
    private bugService: BugService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dailogRef: MatDialogRef<BugComponent>,
    private userService: UserService,
    private projectService: HttpService,
    private authservice: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.user = this.authservice.getUserFromLocalStorage();

    if(this.newBugForm.value.bugId)
    {
      this.qaBugStatus=this.qaBugStatusModify;
    }

    this.populateBugStatusBasedOnUserRole(this.user.UserRole || '{}');
    this.userService.getAllDevUser().subscribe(data => {
      console.log(data);
      this.devUsers = data;
    });
    this.projectService.getProjectById(this.newBugForm.value.projectId).subscribe(data => {
      this.project = data;
    })
  }

  onSubmit() {
    console.log('In BugComponent OnSubmit');
    if (this.newBugForm.valid) {
      if (!this.newBugForm.value.bugId) {
        console.log('In BugComponent OnSubmit if block');
        console.log(this.newBugForm.value);
        console.log(this.user?.UserEmail)
        this.newBugForm.patchValue({
          createdby: this.user?.UserName + " (" + this.user?.UserRole + ")"
        })
        console.log('updated');
        console.log(this.newBugForm.value);
        this.createBug(this.newBugForm.value);
      }
      else {
        console.log('In BugComponent OnSubmit else block');
        console.log(this.newBugForm.value.bugId);
        this.newBugForm.patchValue({
          createdby: this.user?.UserName + " (" + this.user?.UserRole + ")"
        })
        this.updateBug(this.newBugForm.value);
      }
    }
  }

  createBug(bug: Bug) {
    this.bugService.insertBug(bug).subscribe(data => {
      this.notificationService.success('Submitted successfully');
      this.closeDailog();
      this.reload();
    });
  }

  updateBug(bug: Bug) {
    
    console.log(`In BugComponent update bug`);
    this.bugService.updateBug(bug).subscribe(data => {
      this.closeDailog();
      this.notificationService.success('Modified successfully');
      this.reload();
    });
  }

  

  closeDailog() {
    this.bugService.newBugForm.reset;
    this.bugService.initializeFormGroup();
    this.dailogRef.close();
  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`projects/${this.project.projectId}/bugs`]);
    });
  }

  onClose() {
    console.log('In BugComponent onClose');
    this.closeDailog();
  }

  isAdmin(): boolean {
    console.log('In is admin')
    console.log(this.user?.UserRole);
    return this.authservice.isAdmin(this.user?.UserRole || '{}');
  }

  populateBugStatusBasedOnUserRole(userRole: string) {
    console.log(userRole);
    if (userRole == 'DEVELOPER') {
      this.bugStatus = this.devStatus;
    }
    else if (userRole == 'QA') {
      this.bugStatus = this.qaBugStatus;
    }
  }

  isDeveloper() {
    console.log('In is admin')
    console.log(this.user?.UserRole);
    return this.authservice.isDev(this.user?.UserRole || '{}');
  }
}
