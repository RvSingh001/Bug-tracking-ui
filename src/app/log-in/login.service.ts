import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(8)])
  });

  public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  onDataReceived = (close: boolean) => this.dataObsevable.next(close);


  constructor(private http: HttpClient) {
    console.log('in login service')
  }


  loginUser(user: {
    username: string,
    password: string
  }) {
    console.log(`in LoginService loginUser`);
    console.log(user);
    return this.http.post<HttpResponse<any>>(`${environment.baseUrl}users/login`, user, {
       observe: 'response'
    })
      .pipe(catchError(this.handleError));
  }




  handleError(error: HttpErrorResponse) {
    console.log('In loginService handleError');
    console.log(error);
    let errorMessage = 'Unknown error!';
    if (error.status == 403) {
      // Client-side errors
      errorMessage = `Bad Credentials`;
    } else {
      // Server-side errors
      errorMessage = `Something went worng`;
    }
    return throwError(errorMessage);
  }
}
