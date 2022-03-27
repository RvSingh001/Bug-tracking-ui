import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './proejcts/project/project.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectListComponent } from './proejcts/project-list/project-list.component';
import { UserComponent } from './Users/user/user.component';
import { BugComponent } from './bugs/bug/bug.component';
import { UserListComponent } from './Users/user-list/user-list.component';
import { BugListComponent } from './bugs/bug-list/bug-list.component';
import { LogInComponent } from './log-in/log-in.component';
import { ApplicationGuard } from './auth/application-guard';
import { JwtInterceptor } from './JwtInterceptor/JwtInterceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations:
    [
      AppComponent,
      ProjectComponent,
      ProjectListComponent,
      UserComponent,
      UserListComponent,
      BugComponent,
      BugListComponent,
      LogInComponent,
      NavbarComponent,
      PageNotFoundComponent
    ],
  imports:
    [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      MaterialModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      FormsModule,
      CommonModule
    ],

  providers: [ApplicationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
  ],
  bootstrap: [AppComponent],
  //To give Access of ProjectComponent by MatDailog for rendering
  entryComponents: [ProjectComponent, UserComponent, BugComponent],
  
})
export class AppModule { }
