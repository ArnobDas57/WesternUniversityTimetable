import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CourseSearchComponent } from './course-search/course-search.component';
import { CreateSchedComponent } from './create-sched/create-sched.component';
import { DisplayComponent } from './display/display.component';
import { FirebaseAppComponent } from './firebase-app/firebase-app.component';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    CourseSearchComponent,
    CreateSchedComponent,
    DisplayComponent,
    FirebaseAppComponent,
    LoginPageComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }