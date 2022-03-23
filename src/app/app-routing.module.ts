import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationGuard } from './auth/application-guard';
import { BugListComponent } from './bugs/bug-list/bug-list.component';
import { LogInComponent } from './log-in/log-in.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectListComponent } from './proejcts/project-list/project-list.component';
import { UserListComponent } from './Users/user-list/user-list.component';

const routes: Routes =
  [
    { path: 'projects', component: ProjectListComponent, canActivate: [ApplicationGuard] },
    { path: 'users', component: UserListComponent, canActivate: [ApplicationGuard]},
    { path: 'projects/:id/bugs', component: BugListComponent, canActivate: [ApplicationGuard]},
    {path : '', component : LogInComponent},
    {path : 'login', component : LogInComponent},
    {path : '**', component : PageNotFoundComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
