import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot
} from "@angular/router";
import { AuthServiceService } from "./auth-service.service";

@Injectable()

export class ApplicationGuard implements CanActivate {

	constructor(
		private authService: AuthServiceService,
		private router: Router) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
		console.log('In ApplicationGuard')
		var isAuthenticated = this.authService.getAuthStatus();
		console.log(isAuthenticated);

		if (!isAuthenticated) {
			console.log('In if conditipon of can activate')
			this.router.navigate(['']);
		}
		return isAuthenticated;
	}
}
