import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Project } from "src/app/shared/project";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class HttpService {

    projects: Project[] = [];

    newProjectForm: FormGroup = new FormGroup({
        projectId: new FormControl(''),
        projectName: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        userId: new FormControl('')
       
    });

    getProjects(): Project[] {
        return this.projects;
    }

    constructor(private http: HttpClient) {
        this.getAllProjects().subscribe(data => {
            console.log('in HttpService constructor');
            console.log(data);
            this.projects = data;
        });
    }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${environment.baseUrl}projects`)
            .pipe(catchError(this.handleError));;
    }

    getProjectById(id: String): Observable<Project> {
        console.log(`in HttpService getProjectById`);
        console.log(id);
        return this.http.get<Project>(`${environment.baseUrl}projects/${id}`)
            .pipe(catchError(this.handleError));;
    }

    insertProject(project: Project): Observable<Project> {
        console.log(`in HttpService insertProject`);
        console.log(project);
        return this.http.post<Project>(`${environment.baseUrl}projects/`, project)
            .pipe(catchError(this.handleError));
    }

    updateProject(newProject: Project): Observable<Project> {
        console.log(`in HttpService updateProject`);
        console.log(newProject);
        return this.http.put<Project>(`${environment.baseUrl}projects/${newProject.projectId}`, newProject)
            .pipe(catchError(this.handleError));;
    }

    deleteProject(projectId: string): Observable<any> {
        console.log(`in HttpService deleteProject`);
        console.log(projectId);
        return this.http.delete<any>(`${environment.baseUrl}projects/${projectId}`)
            .pipe(catchError(this.handleError));;
    }

    handleError(error: HttpErrorResponse) {
        console.log('Error');
        console.log(error);
        console.log('In httpService handleError');
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    initializeFormGroup(project?: Project) {
        console.log('In httpservice initializeFormGroup');
        if (project == undefined || project == null) {
            this.newProjectForm.setValue({
                projectId: '',
                projectName: '',
                description: '',
                type: '',
                status: '',
                userId: ''
            }
            );
        }
        else {
            console.log('In In httpservice initializeFormGroup else block');
            console.log(project);
            this.newProjectForm.setValue({
                projectId: project.projectId,
                projectName: project.projectName,
                description: project.description,
                status: project.status,
                type: project.type,
                userId: ''
                
                
            });
        }
    }

    populatePartialForm(param: string) {
        console.log('in httpservice populatePartialForm');
        this.initializeFormGroup();
        this.newProjectForm.controls.projectId.setValue(param);
        console.log(this.newProjectForm);
    }
}


