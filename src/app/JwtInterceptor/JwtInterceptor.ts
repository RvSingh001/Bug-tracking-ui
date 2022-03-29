import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../auth/auth-service.service';
import { environment } from "src/environments/environment";

@Injectable()

export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthServiceService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        console.log('in JwtInterceptor intercept');
        const token = this.authService.getTokenFromLocalStrorage();
        const isLoggedIn = !!token;
        const isApiUrl = request.url.startsWith(environment.baseUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }
        //        console.log(request);
        return next.handle(request);
    }
}