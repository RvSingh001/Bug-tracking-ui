import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "src/app/shared/user";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})
export class UserService {
    // });   
    getAllDevUser() {
        return this.http.get<User[]>(`${environment.baseUrl}users/dev`)
            .pipe(catchError(this.handleError));;
    }
    users: User[] = [];
    newUserForm: FormGroup = new FormGroup({
        userId: new FormControl(''),
        role: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    getUsers(): User[] {
        return this.users;
    }
    constructor(private http: HttpClient) {
        console.log('In User Service consturctor');
    }
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.baseUrl}users`)
            .pipe(catchError(this.handleError));;
    }


    getUserById(id: String): Observable<User> {
        console.log(`in HttpService getUserById`);
        console.log(id);
        return this.http.get<User>(`${environment.baseUrl}users/${id}`)
            .pipe(catchError(this.handleError));;
    }


    insertUser(user: User): Observable<User> {
        console.log(`in HttpService insertUser`);
        console.log(user);
        return this.http.post<User>(`${environment.baseUrl}users/`, user)
            .pipe(catchError(this.handleError));
    }
    updateUser(newUser: User): Observable<User> {
        console.log(`in HttpService updateUser`);
        console.log(newUser);
        return this.http.put<User>(`${environment.baseUrl}users/${newUser.userId}`, newUser)
            .pipe(catchError(this.handleError));;
    }
    deleteUser(userId: string): Observable<any> {
        console.log(`in HttpService deleteUser`);
        console.log(userId);
        return this.http.delete<any>(`${environment.baseUrl}users/${userId}`)
            .pipe(catchError(this.handleError));;
    }

    handleError(error: HttpErrorResponse) {
        console.log('In UserService handleError');
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            console.log('In handleError if block')
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            console.log('In handleError else block')
            errorMessage = error.error.message;
        }
        return throwError(errorMessage);
    }

    public initializeFormGroupUser(user?: User) {
        console.log('In httpservice initializeFormGroupUser');
        if (user == undefined || user == null) {
            this.newUserForm.setValue({
                userId: '',
                role: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            }
            );
        }
        else {
            console.log('In In httpservice initializeFormGroupUser else block');
            console.log(user);
            this.newUserForm.setValue({
                userId: user.userId,
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password
            });
        }
    }
    populatePartialFormUser(param: string) {
        console.log('in httpservice populatePartialFormUser');
        this.initializeFormGroupUser();
        this.newUserForm.controls.userId.setValue(param);
        console.log(this.newUserForm);
    }

    activetedUser(userId: string): Observable<any> {
        console.log(`in HttpService deleteUser`);
        console.log(userId);
        return this.http.put<any>(`${environment.baseUrl}users/${userId}/active`, null)
            .pipe(catchError(this.handleError));;
    }

}
