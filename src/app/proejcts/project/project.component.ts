import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../shared/project';
import { HttpService } from '../service/project-service';
import { NotificationService } from '../service/notification-service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  newProjectForm: FormGroup = this.projectService.newProjectForm;
  projectStatus = ['ACTIVE', 'NOT_ACTIVE', 'DEPLOYED', 'CLOSE', 'INPROGRESS'];
  projectTypes = ['Production', 'Social', 'Educational', 'Community', 'Research', 'Others', 'TELECOM'];

  constructor(
    private projectService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dailogRef: MatDialogRef<ProjectComponent>) { }

  ngOnInit(): void {
    console.log("Project Component On init")
  }

  onSubmit() {
    console.log('In ProjectComponent OnSubmit');
    if (this.newProjectForm.valid) {
      if (!this.newProjectForm.value.projectId) {
        this.createProject(this.newProjectForm.value);
      }
      else {
        this.updateProject(this.newProjectForm.value);
      }
    }
  }

  createProject(project: Project) {
    this.projectService.insertProject(project).subscribe(data => {
      this.notificationService.success('::Submitted successfully');
      this.closeDailog();
      this.reload();
    });
  }

  updateProject(project: Project) {
    console.log(`In ProjectComponent update project`);
    this.projectService.updateProject(project).subscribe(data => {
      this.closeDailog();
      this.notificationService.success('::Modified successfully');
      this.reload();
    });
  }

  onClear() {
    console.log("In ProjectComponent onClear")
    let projectId = this.newProjectForm.value.projectId;
    if (projectId) {
      console.log("In ProjectComponent onClear if block");
      this.newProjectForm.reset();
      this.projectService.populatePartialForm(projectId);
    }
    else {
      console.log("In ProjectComponent onClear else block");
      this.newProjectForm.reset();
      this.projectService.initializeFormGroup();
    }
  }

  closeDailog() {
    this.projectService.newProjectForm.reset;
    this.projectService.initializeFormGroup();
    this.dailogRef.close();
  }

  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/projects']);
    });
  }

  onClose() {
    console.log('In ProjectComponent onClose');
    this.closeDailog();
  }
}
