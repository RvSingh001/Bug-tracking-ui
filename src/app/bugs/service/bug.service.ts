import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { Bug } from 'src/app/shared/bug';
import { Project } from 'src/app/shared/project';
import { User } from 'src/app/shared/user';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class BugService {
    projects: Project[] = [];
    users: User[] = [];
    bugs: Bug[] = [];
    newBugForm: FormGroup = new FormGroup({
        bugId: new FormControl(''),
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        priority: new FormControl('', Validators.required),
        projectId: new FormControl('', Validators.required),
        userId: new FormControl('', Validators.required),
        createdBy: new FormControl('')
    });

    getBugs(): Bug[] {
        return this.bugs;
    }

    constructor(private http: HttpClient) {
        this.getAllBugs().subscribe(data => {
            console.log('in BugService constructor');
            console.log(data);
            this.bugs = data;
        });
    }

    getAllBugs(): Observable<Bug[]> {
        return this.http.get<Bug[]>(`${environment.baseUrl}bugs`)
            .pipe(catchError(this.handleError));;
    }

    getAllByProject(id: string): Observable<Bug[]> {
        return this.http.get<Bug[]>(`${environment.baseUrl}projects/${id}/bugs`)
            .pipe(catchError(this.handleError));;
    }

    getBugById(id: String): Observable<Bug> {
        console.log(`in bugService getBugById`);
        console.log(id);
        return this.http.get<Bug>(`${environment.baseUrl}bugs/${id}`)
            .pipe(catchError(this.handleError));;
    }

    insertBug(bug: Bug): Observable<Bug> {
        console.log(`in bugService insertProject`);
        console.log(bug);
        return this.http.post<Bug>(`${environment.baseUrl}bugs/`, bug)
            .pipe(catchError(this.handleError));
    }

    updateBug(newBug: Bug): Observable<Bug> {
        console.log(`in bugService updateBug`);
        console.log(newBug);
        return this.http.put<Bug>(`${environment.baseUrl}bugs/${newBug.bugId}`, newBug)
            .pipe(catchError(this.handleError));;
    }

    deleteBug(bugId: string): Observable<any> {
        console.log(`in bugService deleteProject`);
        console.log(bugId);
        return this.http.delete<any>(`${environment.baseUrl}bugs/${bugId}`)
            .pipe(catchError(this.handleError));;
    }

    handleError(error: HttpErrorResponse) {
        console.log('In bugService handleError');
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(error);
        return throwError(errorMessage);
    }

    initializeFormGroup(bug?: Bug) {
        console.log('In bugService initializeFormGroup');
        if (bug == undefined || bug == null) {
            this.newBugForm.setValue({
                bugId: '',
                title: '',
                description: '',
                status: '',
                priority: '',
                projectId: '',
                userId: '',
                createdBy: ''
            }
            );
        }
        else {
            console.log('In  bugService initializeFormGroup else block');
            console.log(bug);
            this.newBugForm.setValue({
                bugId: bug.bugId,
                title: bug.title,
                description: bug.description,
                status: bug.status,
                priority: bug.priority,
                projectId: bug.projectId,
                userId: bug.userId,
                createdBy: bug.createdBy
            });
        }
    }

    populatePartialForm(param: Bug) {
        console.log('in bugService populatePartialForm');
        this.initializeFormGroup();
        this.newBugForm.patchValue(param);
        console.log(this.newBugForm.value);
    }
}
